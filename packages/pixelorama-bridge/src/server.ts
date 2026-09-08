import { WebSocketServer, WebSocket } from "ws";
import {
  BridgeCommand,
  BridgeRequest,
  BridgeResponse,
  BridgeEvent,
  createBridgeRequest,
  BridgeResponseSchema,
  BridgeEventSchema
} from "@pixelorama/protocol";
import { PixeloramaMcpError, ErrorCodes } from "@pixelorama/shared";

export interface BridgeServerOptions {
  port?: number;
  host?: string;
  defaultTimeoutMs?: number;
}

export type EventListener = (event: BridgeEvent) => void;

export class PixeloramaBridgeServer {
  private wss: WebSocketServer | null = null;
  private activeSocket: WebSocket | null = null;
  private pendingRequests = new Map<
    string,
    {
      resolve: (data: unknown) => void;
      reject: (error: Error) => void;
      timer: NodeJS.Timeout;
    }
  >();
  private eventListeners = new Set<EventListener>();
  private readonly port: number;
  private readonly host: string;
  private readonly defaultTimeoutMs: number;

  constructor(options?: BridgeServerOptions) {
    this.port = options?.port ?? 18814;
    this.host = options?.host ?? "127.0.0.1";
    this.defaultTimeoutMs = options?.defaultTimeoutMs ?? 30000;
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.wss = new WebSocketServer({
          port: this.port,
          host: this.host
        });

        this.wss.on("listening", () => {
          resolve();
        });

        this.wss.on("error", (err) => {
          reject(err);
        });

        this.wss.on("connection", (socket: WebSocket) => {
          this.activeSocket = socket;

          socket.on("message", (raw: Buffer | string) => {
            this.handleIncomingMessage(raw.toString("utf-8"));
          });

          socket.on("close", () => {
            if (this.activeSocket === socket) {
              this.activeSocket = null;
            }
          });

          socket.on("error", () => {
            if (this.activeSocket === socket) {
              this.activeSocket = null;
            }
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      for (const [id, pending] of this.pendingRequests.entries()) {
        clearTimeout(pending.timer);
        pending.reject(
          new PixeloramaMcpError(ErrorCodes.EXTENSION_NOT_CONNECTED, "Bridge server stopping")
        );
        this.pendingRequests.delete(id);
      }

      if (this.activeSocket) {
        this.activeSocket.close();
        this.activeSocket = null;
      }

      if (this.wss) {
        this.wss.close(() => {
          this.wss = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  isConnected(): boolean {
    return this.activeSocket !== null && this.activeSocket.readyState === WebSocket.OPEN;
  }

  async waitForConnection(timeoutMs = 15000): Promise<boolean> {
    if (this.isConnected()) {
      return true;
    }

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (this.isConnected()) {
        return true;
      }
      await new Promise((r) => setTimeout(r, 250));
    }

    return this.isConnected();
  }

  async sendCommand<T = unknown>(command: BridgeCommand, timeoutMs?: number): Promise<T> {
    if (!this.isConnected()) {
      throw new PixeloramaMcpError(
        ErrorCodes.EXTENSION_NOT_CONNECTED,
        "Pixelorama extension is not connected to the bridge. Ensure Pixelorama is open and extension is enabled."
      );
    }

    const request: BridgeRequest = createBridgeRequest(command);
    const timeout = timeoutMs ?? this.defaultTimeoutMs;

    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(
          new PixeloramaMcpError(
            ErrorCodes.BRIDGE_TIMEOUT,
            `Command '${command.command}' timed out after ${timeout}ms`
          )
        );
      }, timeout);

      this.pendingRequests.set(request.id, {
        resolve: resolve as (data: unknown) => void,
        reject,
        timer
      });

      this.activeSocket!.send(JSON.stringify(request));
    });
  }

  addEventListener(listener: EventListener): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  private handleIncomingMessage(rawText: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return;
    }

    const eventResult = BridgeEventSchema.safeParse(parsed);
    if (eventResult.success) {
      for (const listener of this.eventListeners) {
        try {
          listener(eventResult.data);
        } catch {}
      }
      return;
    }

    const responseResult = BridgeResponseSchema.safeParse(parsed);
    if (responseResult.success) {
      const response = responseResult.data;
      const pending = this.pendingRequests.get(response.id);
      if (!pending) {
        return;
      }

      clearTimeout(pending.timer);
      this.pendingRequests.delete(response.id);

      if (response.success) {
        pending.resolve(response.data);
      } else {
        const err = response.error;
        pending.reject(
          new PixeloramaMcpError(
            err?.code ?? "UNKNOWN_ERROR",
            err?.message ?? "Pixelorama command failed",
            err?.details
          )
        );
      }
    }
  }
}
