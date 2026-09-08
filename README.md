# Pixelorama Game Asset MCP 🎨

> **Hệ thống MCP điều khiển Pixelorama thiết kế Asset 2D Game theo thời gian thực (Live Visible Drawing).**  
> AI trực tiếp mở Pixelorama, tạo layer, đặt palette, vẽ từng nét pixel trực quan, tạo animation frame chân thực, tự động chạy Quality Gate kiểm tra và sửa lỗi, sau đó lưu file gốc `.pxo` và xuất Spritesheet PNG game-ready.

---

## ⚡ 1. Yêu cầu hệ thống

- **Node.js**: Phiên bản 18+ (khuyên dùng Node 20 hoặc 22/24).
- **pnpm**: `npm install -g pnpm`
- **Pixelorama**: Phiên bản `v1.2.1-stable` (Godot 4 Engine). Tải miễn phí tại [pixelorama.org](https://pixelorama.org) hoặc [GitHub Releases](https://github.com/Orama-Interactive/Pixelorama/releases).

---

## 🚀 2. Cài đặt nhanh trong 3 bước

### Bước 1: Tải mã nguồn & Build dự án
Mở Terminal (PowerShell hoặc CMD) và chạy:
```bash
git clone https://github.com/Orama-Interactive/pixelorama-game-asset-mcp.git
cd pixelorama-game-asset-mcp
pnpm install
pnpm build
```

### Bước 2: Cài Extension vào Pixelorama với 1 lệnh
Chạy lệnh CLI sau để tự động đóng gói extension, sao chép vào thư mục Pixelorama và tự kích hoạt:
```bash
pnpm --filter=pixelorama-mcp-cli start install-extension
```

Kiểm tra sức khỏe hệ thống:
```bash
pnpm --filter=pixelorama-mcp-cli start doctor
```
*(Nếu tất cả các mục đều báo `[OK]`, hệ thống đã sẵn sàng 100%!)*

### Bước 3: Chạy thử bản Demo tự động (Tùy chọn)
Để tận mắt thấy AI mở Pixelorama và tự động vẽ nhân vật 32x32:
```bash
pnpm --filter=pixelorama-mcp-cli start demo
```

---

## ⚙️ 3. Cấu hình AI Client

Thêm cấu hình MCP vào ứng dụng AI bạn đang dùng:

### 3.1 Antigravity IDE / Antigravity CLI
Thêm vào file cấu hình MCP của Antigravity (hoặc chạy `pnpm --filter=pixelorama-mcp-cli start configure antigravity`):
```json
{
  "mcpServers": {
    "pixelorama-game-asset-mcp": {
      "command": "node",
      "args": [
        "D:/Code/pixelorama-game-asset-mcp/apps/mcp-server/dist/index.js"
      ]
    }
  }
}
```
*(Lưu ý: Thay đổi đường dẫn `D:/Code/pixelorama-game-asset-mcp` thành đường dẫn thực tế trên máy bạn).*

### 3.2 Claude Desktop (`claude_desktop_config.json`)
Mở file cấu hình Claude Desktop tại `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "pixelorama": {
      "command": "node",
      "args": [
        "D:/Code/pixelorama-game-asset-mcp/apps/mcp-server/dist/index.js"
      ]
    }
  }
}
```

### 3.3 Cursor / VS Code / Cline
Tạo hoặc sửa file `.cursor/mcp.json` hoặc cấu hình MCP tương ứng:
```json
{
  "mcpServers": {
    "pixelorama": {
      "command": "node",
      "args": [
        "D:/Code/pixelorama-game-asset-mcp/apps/mcp-server/dist/index.js"
      ]
    }
  }
}
```

---

## 🎮 4. Cách sử dụng: Ra lệnh cho AI

Sau khi kết nối MCP, bạn chỉ cần chat trực tiếp với AI bằng ngôn ngữ tự nhiên:

### Ví dụ 1: Tạo nhân vật nông dân (Farming Character)
```text
Tạo giúp tôi một nhân vật farmer nữ 32x32 cho game farming RPG.
Phong cách: cozy colorful pixel art, bảng màu ấm, silhouette rõ ràng.
Animation: idle (4 hướng) và walk (4 hướng).
Hãy mở Pixelorama, vẽ trực tiếp từng layer (shadow, body, clothing, hair, hat),
kiểm tra chất lượng và xuất spritesheet + file .pxo.
```

### Ví dụ 2: Tạo vũ khí / Vật phẩm (Item Icon)
```text
Thiết kế icon 32x32 cho thanh kiếm Iron Broadsword.
Phong cách 16-bit RPG cổ điển, viền đậm rõ nét, nền trong suốt.
Lưu file gốc vào thư mục game-art/source và xuất PNG runtime.
```

### Ví dụ 3: Tạo Boss quái vật
```text
Tạo boss Forest Guardian kích thước 64x64 dạng cổ thụ bóng tối.
Có animation: idle, slam attack, hurt, death.
Hãy kiểm tra đảm bảo các frame không bị duplicate hoặc trượt sprite giả tạo.
```

### Ví dụ 4: Tạo bộ Tileset địa hình
```text
Tạo bộ tileset 32x32 phong cách đồng quê gồm:
Cỏ (grass), đất cày (soil), đường đi (dirt path), mặt nước (water).
Chạy kiểm tra QA seam test để đảm bảo không bị lộ mối nối khi ghép map.
```

---

## 🔍 5. Quy trình thiết kế & Kiểm định tự động

Khi nhận yêu cầu, AI sẽ thực thi theo chu trình khép kín:

```text
Yêu cầu người dùng
       ↓
Đọc Art Direction & Đặc tả Asset (asset-spec)
       ↓
Tự động khởi động Pixelorama (nếu chưa mở)
       ↓
Kết nối WebSocket Bridge (127.0.0.1:18814)
       ↓
Tạo Project & Layers trực tiếp trong Pixelorama
       ↓
Live Drawing: Người dùng thấy AI vẽ từng pixel và di chuyển con trỏ AI
       ↓
Tạo Animation Keyframes với chuyển động chân tay thật
       ↓
Chạy Animation Preview trên Timeline Pixelorama
       ↓
Chụp Snapshot & Chạy Quality Gate (Phát hiện lỗi pixel, alpha, fake animation)
       ↓
Tự động quay lại Layer/Frame bị lỗi để sửa trực quan (Auto-fix)
       ↓
Đạt Quality Gate PASS
       ↓
Lưu file gốc Pixelorama (.pxo)
       ↓
Xuất Spritesheet PNG + Godot 4 Resource (.tres) + Metadata JSON
```

---

## 🛠️ 6. Bảng lệnh CLI (`pixelorama-mcp`)

| Lệnh CLI | Mô tả |
| :--- | :--- |
| `pnpm --filter=pixelorama-mcp-cli start doctor` | Kiểm tra môi trường Node, Pixelorama, cổng mạng và extension |
| `pnpm --filter=pixelorama-mcp-cli start install-extension` | Đóng gói và cài đặt Extension tự động vào Pixelorama |
| `pnpm --filter=pixelorama-mcp-cli start configure [client]` | Tự động tạo mẫu cấu hình MCP (`antigravity`, `claude`, `cursor`, `vscode`, `all`) |
| `pnpm --filter=pixelorama-mcp-cli start demo` | Chạy quy trình vẽ trực tiếp toàn diện mẫu nhân vật 32x32 |
| `pnpm --filter=pixelorama-mcp-cli start status` | Kiểm tra kết nối bridge hiện tại tới Pixelorama |
| `pnpm --filter=pixelorama-mcp-cli start start` | Khởi chạy MCP Server độc lập |

---

## 📁 7. Cấu trúc thư mục đầu ra (`game-art/`)

Sau khi hoàn tất vẽ, các tệp thành phẩm sẽ nằm tại:
- `game-art/source/`: Tệp dự án gốc Pixelorama (`.pxo`) chứa đầy đủ các layer, timeline, palette và animation tags.
- `game-art/runtime/`: Tệp ảnh spritesheet PNG (`*_sheet.png`) và tài nguyên Godot 4 `SpriteFrames` (`*_frames.tres`).
- `game-art/metadata/`: Tệp JSON chứa thông số kỹ thuật (rect từng frame, fps, loop, pivot, anchor, sự kiện).
- `game-art/manifests/`: Tệp tổng `asset-manifest.json` theo dõi tất cả asset, phiên bản và trạng thái Quality Gate.

---

## ❓ 8. Câu hỏi thường gặp & Khắc phục lỗi

### 1. AI báo lỗi `EXTENSION_NOT_CONNECTED`?
- **Nguyên nhân**: Pixelorama chưa mở hoặc Extension chưa được bật.
- **Khắc phục**: Chạy lệnh `pnpm --filter=pixelorama-mcp-cli start install-extension`, sau đó khởi động lại Pixelorama. Trong Pixelorama, vào menu **Help > Preferences > Extensions** và đảm bảo `AI Game Asset Studio` đang ở trạng thái kích hoạt.

### 2. Có thể tạm dừng khi AI đang vẽ không?
- **Có**: Trên giao diện Pixelorama có panel riêng **AI Game Asset Studio**. Bạn có thể bấm nút **Pause** để tạm dừng, **Resume** để tiếp tục, hoặc **Stop** để hủy vẽ bất cứ lúc nào.

### 3. File PNG xuất ra có dùng được cho Unity / Godot / Web không?
- **Hoàn toàn dùng được**: Đầu ra là spritesheet chuẩn PNG trong suốt kèm file metadata JSON chuẩn hóa, tương thích mọi game engine (Unity, Unreal, Godot 4, Defold, Phaser, PixiJS). Dự án còn tự động xuất sẵn file `.tres` nạp trực tiếp vào Godot 4.
