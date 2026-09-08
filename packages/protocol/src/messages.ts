import { BridgeCommand, BridgeRequest, BridgeResponse, BridgeEvent } from "./schemas.js";

let requestIdCounter = 0;

export function createBridgeRequest(command: BridgeCommand): BridgeRequest {
  requestIdCounter += 1;
  return {
    id: `req-${Date.now()}-${requestIdCounter}`,
    command
  };
}

export function createBridgeSuccessResponse(id: string, data?: unknown): BridgeResponse {
  return {
    id,
    success: true,
    data
  };
}

export function createBridgeErrorResponse(
  id: string,
  code: string,
  message: string,
  details?: unknown
): BridgeResponse {
  return {
    id,
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}

export function createProgressEvent(
  operationId: string,
  current: number,
  total: number,
  stage: string,
  message?: string
): BridgeEvent {
  return {
    event: "operation.progress",
    operationId,
    current,
    total,
    stage,
    message
  };
}
