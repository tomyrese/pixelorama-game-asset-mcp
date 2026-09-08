# Pixelorama Game Asset MCP - Research Report

## 1. Executive Summary

This research investigates the technical requirements, internal architecture, and integration points for building `pixelorama-game-asset-mcp`. The system allows standard Model Context Protocol (MCP) clients to directly command Pixelorama v1.2.1-stable to author, animate, validate, and export 2D pixel art game assets through live visible execution.

- **Date of Research**: September 8, 2026
- **Pixelorama Version**: `v1.2.1-stable`
- **Godot Engine Version**: `v4.7.1.stable.official.a13da4feb`
- **Extensions API Version**: `9` (with backwards compatibility fallback to `8`)
- **PXO File Format Version**: `7`
- **Target OS**: Windows 11 / Windows 10 (architected for cross-platform Linux / macOS expansion)
- **MCP TypeScript SDK Version**: `1.30.0`
- **MCP Transports**: `stdio` and `Streamable HTTP`

---

## 2. Pixelorama Extension System Architecture

### 2.1 Storage and Discovery
- **Windows User Path**: `%APPDATA%\pixelorama\extensions\` (`user://extensions/`)
- **Supported Archive Formats**: `.zip` and `.pck`
- **Mounting Mechanism**: Pixelorama invokes `ProjectSettings.load_resource_pack(file_path)` to mount the extension archive directly into the Godot virtual file system (`res://`).
- **Internal Archive Layout**:
  For an extension named `ai_game_asset_studio`, the internal archive hierarchy must be rooted at:
  ```
  src/Extensions/ai_game_asset_studio/
  ├── extension.json
  ├── Main.tscn
  ├── Main.gd
  ├── BridgeClient.gd
  ├── LiveOperationQueue.gd
  ├── AICursorOverlay.gd
  ├── AIStudioPanel.tscn
  ├── AIStudioPanel.gd
  └── PixeloramaController.gd
  ```

### 2.2 Extension Metadata (`extension.json`)
The configuration file specifies entry points and compatibility:
```json
{
  "name": "ai_game_asset_studio",
  "display_name": "AI Game Asset Studio",
  "description": "Live AI Game Asset Studio & MCP Bridge for Pixelorama",
  "author": "Antigravity",
  "version": 1.0,
  "supported_api_versions": [9, 8],
  "license": "MIT",
  "nodes": [
    "Main.tscn"
  ]
}
```

### 2.3 Automatic Activation on Startup
Extensions are activated based on settings in `user://config.ini` (`%APPDATA%\pixelorama\config.ini`). Under the `[extensions]` section, setting `ai_game_asset_studio=true` instructs Pixelorama to automatically instantiate the extension nodes on startup.

---

## 3. Pixelorama Core APIs & Capabilities

### 3.1 ExtensionsApi
Accessed in GDScript via:
```gdscript
var api = get_node_or_null("/root/ExtensionsApi")
```
Sub-APIs available:
- **`general`**: Autoload access (`Global`, `DrawingAlgos`), application version, canvas access (`Global.canvas`).
- **`project`**:
  - `new_project(frames, name, size, fill_color, is_resource)`
  - `new_empty_project(name, is_resource)`
  - `get_project_info(project)`
  - `select_cels([[frame, layer]])`
  - `get_current_cel()`
  - `get_cel_at(project, frame, layer)`
  - `set_pixelcel_image(image, frame, layer)`
  - `add_new_frame(after_frame)`
  - `add_new_layer(above_layer, name, type)`
- **`panel`**:
  - `add_node_as_tab(node)`: Integrates custom dockable UI panels into the Pixelorama workspace.
  - `remove_node_from_tab(node)`
- **`palette`**:
  - `create_palette_from_data(palette_name, data, is_global)`
  - `Palettes.select_palette(name)`
- **`export`**:
  - `add_export_option()`, access to `Export` singleton.
- **`import`**:
  - `open_save_autoload() -> OpenSave`
- **`signals`**:
  - `signal_project_created`, `signal_project_saved`, `signal_project_switched`, `signal_cel_switched`, `signal_project_data_changed`, `signal_timeline_animation_started`, `signal_timeline_animation_finished`.

### 3.2 Native Drawing & Canvas Manipulation
- Drawing is conducted directly on `PixelCel` instances using Godot's native `Image` operations (`set_pixel`, `fill_rect`, `blit_rect`).
- Visual canvas synchronization is achieved by triggering `cel.update_texture()` and queuing redraw on `Global.canvas`.
- Operations are integrated with Pixelorama's `project.undo_redo` stack to maintain full undo/redo integrity.

---

## 4. Bridge & Inter-Process Communication

### 4.1 Transport Choice
- **Protocol**: WebSocket over loopback (`127.0.0.1:18814`).
- **Server**: Node.js WebSocket Server hosted within the MCP bridge package.
- **Client**: Godot 4 `WebSocketPeer` running in the extension `_process` loop.
- **Security**: Local-only loopback binding with session tokens and request authorization.
- **Resilience**: Automatic reconnection loop with exponential backoff on both server and client restarts.

### 4.2 Live Visible Editing & Operation Queue
To allow users to watch artwork form incrementally, the queue supports three execution modes:
- **`live`**: Operations are batched into small strokes (5-25 pixels), yielding execution via `await get_tree().process_frame` so the user observes every change in real time.
- **`fast`**: Updates occur by structural stage (silhouette, base colors, shading, details, animation).
- **`instant`**: Batch execution for rapid operations.

---

## 5. Model Context Protocol (MCP) Integration

### 5.1 Official SDK
- Package: `@modelcontextprotocol/sdk` (v1.30.0).
- Supports dual transports:
  - `StdioServerTransport` for standard command-line and local process clients.
  - `StreamableHTTPServerTransport` for modern HTTP streaming and remote-compatible hosts.

### 5.2 Primitive and High-Level Tools
- **Primitive tools**: Direct, uncompromised control over projects, canvas, layers, frames, pixels, palettes, animations, and exports.
- **Workflow tools**: Orchestrated pipelines that compile high-level prompts into sequential, live-rendered Pixelorama operations.
