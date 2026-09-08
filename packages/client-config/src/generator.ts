export type SupportedClient =
  | "antigravity"
  | "claude_desktop"
  | "cursor"
  | "vscode"
  | "cline"
  | "continue"
  | "generic";

export interface ClientConfigOutput {
  client: SupportedClient;
  suggestedFilePath: string;
  configJson: Record<string, unknown>;
}

export function generateClientConfig(
  client: SupportedClient,
  serverCommand: string,
  serverArgs: string[] = ["start"]
): ClientConfigOutput {
  switch (client) {
    case "antigravity":
      return {
        client: "antigravity",
        suggestedFilePath: "antigravity.mcp.json",
        configJson: {
          mcpServers: {
            "pixelorama-game-asset-mcp": {
              command: serverCommand,
              args: serverArgs
            }
          }
        }
      };

    case "claude_desktop":
      return {
        client: "claude_desktop",
        suggestedFilePath: "%APPDATA%\\Claude\\claude_desktop_config.json",
        configJson: {
          mcpServers: {
            "pixelorama": {
              command: serverCommand,
              args: serverArgs
            }
          }
        }
      };

    case "cursor":
      return {
        client: "cursor",
        suggestedFilePath: ".cursor/mcp.json",
        configJson: {
          mcpServers: {
            "pixelorama": {
              command: serverCommand,
              args: serverArgs
            }
          }
        }
      };

    case "vscode":
      return {
        client: "vscode",
        suggestedFilePath: ".vscode/mcp.json",
        configJson: {
          servers: {
            "pixelorama": {
              command: serverCommand,
              args: serverArgs
            }
          }
        }
      };

    case "cline":
      return {
        client: "cline",
        suggestedFilePath: "cline_mcp_settings.json",
        configJson: {
          mcpServers: {
            "pixelorama": {
              command: serverCommand,
              args: serverArgs
            }
          }
        }
      };

    default:
      return {
        client: "generic",
        suggestedFilePath: "mcp-config.json",
        configJson: {
          mcpServers: {
            "pixelorama-game-asset-mcp": {
              command: serverCommand,
              args: serverArgs
            }
          }
        }
      };
  }
}
