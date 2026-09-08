export class PixeloramaMcpError extends Error {
  readonly code: string;
  readonly details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = "PixeloramaMcpError";
    this.code = code;
    this.details = details;
  }
}

export const ErrorCodes = {
  PIXELORAMA_NOT_RUNNING: "PIXELORAMA_NOT_RUNNING",
  EXTENSION_NOT_CONNECTED: "EXTENSION_NOT_CONNECTED",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
  LAYER_NOT_FOUND: "LAYER_NOT_FOUND",
  FRAME_NOT_FOUND: "FRAME_NOT_FOUND",
  INVALID_PIXEL_DATA: "INVALID_PIXEL_DATA",
  API_VERSION_UNSUPPORTED: "API_VERSION_UNSUPPORTED",
  EXPORT_FAILED: "EXPORT_FAILED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  BRIDGE_TIMEOUT: "BRIDGE_TIMEOUT",
  INVALID_COORDINATES: "INVALID_COORDINATES",
  CANVAS_EMPTY: "CANVAS_EMPTY"
} as const;
