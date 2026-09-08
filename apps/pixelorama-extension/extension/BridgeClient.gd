extends Node

var queue: Node = null
var controller: Node = null
var ws := WebSocketPeer.new()
var is_connected_to_server := false
var reconnect_timer := 0.0
const RECONNECT_INTERVAL := 2.0
const SERVER_URL := "ws://127.0.0.1:18814"

signal connection_state_changed(connected: bool)

func _ready() -> void:
	if queue:
		queue.operation_progress.connect(_on_queue_progress)
	connect_to_server()

func _process(delta: float) -> void:
	ws.poll()
	var state = ws.get_ready_state()
	
	if state == WebSocketPeer.STATE_OPEN:
		if not is_connected_to_server:
			is_connected_to_server = true
			connection_state_changed.emit(true)
			
		while ws.get_available_packet_count() > 0:
			var packet = ws.get_packet()
			var text = packet.get_string_from_utf8()
			_handle_incoming_text(text)
	elif state == WebSocketPeer.STATE_CLOSED or state == WebSocketPeer.STATE_CLOSING:
		if is_connected_to_server:
			is_connected_to_server = false
			connection_state_changed.emit(false)
			
		reconnect_timer += delta
		if reconnect_timer >= RECONNECT_INTERVAL:
			reconnect_timer = 0.0
			connect_to_server()

func connect_to_server() -> void:
	ws.connect_to_url(SERVER_URL)

func send_json(data: Dictionary) -> void:
	if ws.get_ready_state() == WebSocketPeer.STATE_OPEN:
		var s = JSON.stringify(data)
		ws.send_text(s)

func _on_queue_progress(op_id: String, current: int, total: int, stage: String) -> void:
	send_json({
		"event": "operation.progress",
		"operationId": op_id,
		"current": current,
		"total": total,
		"stage": stage
	})

func _handle_incoming_text(text: String) -> void:
	var parsed = JSON.parse_string(text)
	if typeof(parsed) != TYPE_DICTIONARY:
		return
		
	var req_id = str(parsed.get("id", ""))
	var cmd_data = parsed.get("command")
	if typeof(cmd_data) != TYPE_DICTIONARY:
		return
		
	var cmd_name = str(cmd_data.get("command", ""))
	_dispatch_command(req_id, cmd_name, cmd_data)

func _dispatch_command(req_id: String, cmd_name: String, cmd_data: Dictionary) -> void:
	if not controller:
		_send_error(req_id, "CONTROLLER_MISSING", "PixeloramaController is not initialized")
		return
		
	match cmd_name:
		"status":
			var p = controller.get_current_project()
			_send_success(req_id, {
				"connected": true,
				"hasProject": p != null,
				"projectName": p.name if p else ""
			})
			
		"project.create":
			var name = str(cmd_data.get("name", "untitled"))
			var w = int(cmd_data.get("width", 64))
			var h = int(cmd_data.get("height", 64))
			var col_str = str(cmd_data.get("fillColor", "#00000000"))
			var col = Color.from_string(col_str, Color(0, 0, 0, 0))
			var res = controller.create_project(name, w, h, col)
			_send_success(req_id, res)
			
		"project.open":
			var path = str(cmd_data.get("path", ""))
			var ok = controller.open_project(path)
			_send_success(req_id, {"opened": ok})
			
		"project.save":
			var path = str(cmd_data.get("path", ""))
			var ok = controller.save_project(path)
			_send_success(req_id, {"saved": ok})
			
		"project.inspect":
			var info = controller.inspect_project()
			_send_success(req_id, info)
			
		"canvas.snapshot":
			var fi = int(cmd_data.get("frameIndex", -1))
			var snap = controller.take_snapshot(fi)
			_send_success(req_id, snap)
			
		"layer.create":
			var lname = str(cmd_data.get("name", "Layer"))
			var above = int(cmd_data.get("aboveLayer", 0))
			var ltype = int(cmd_data.get("layerType", 0))
			controller.create_layer(lname, above, ltype)
			_send_success(req_id, {"created": true})
			
		"layer.rename":
			var lidx = int(cmd_data.get("layerIndex", 0))
			var lname = str(cmd_data.get("name", "Layer"))
			controller.rename_layer(lidx, lname)
			_send_success(req_id, {"renamed": true})
			
		"layer.select":
			var lidx = int(cmd_data.get("layerIndex", 0))
			controller.select_layer(lidx)
			_send_success(req_id, {"selected": true})
			
		"frame.create":
			var after = int(cmd_data.get("afterFrame", 0))
			controller.create_frame(after)
			_send_success(req_id, {"created": true})
			
		"frame.select":
			var fidx = int(cmd_data.get("frameIndex", 0))
			controller.select_frame(fidx)
			_send_success(req_id, {"selected": true})
			
		"frame.duration":
			var fidx = int(cmd_data.get("frameIndex", 0))
			var dur = float(cmd_data.get("duration", 1.0))
			controller.set_frame_duration(fidx, dur)
			_send_success(req_id, {"updated": true})
			
		"draw.pixels":
			var pixels = cmd_data.get("pixels", [])
			var mode = str(cmd_data.get("mode", "live"))
			if queue:
				await queue.execute_draw_pixels(req_id, pixels, mode)
			else:
				controller.draw_pixel_list(pixels)
			_send_success(req_id, {"drawn": true})
			
		"draw.pixel_runs":
			var runs = cmd_data.get("runs", [])
			var mode = str(cmd_data.get("mode", "live"))
			if queue:
				await queue.execute_draw_runs(req_id, runs, mode)
			else:
				controller.draw_runs(runs)
			_send_success(req_id, {"drawn": true})
			
		"draw.erase":
			var pixels = cmd_data.get("pixels", [])
			controller.erase_pixels(pixels)
			_send_success(req_id, {"erased": true})
			
		"cel.clear":
			var fidx = int(cmd_data.get("frameIndex", -1))
			var lidx = int(cmd_data.get("layerIndex", -1))
			controller.clear_cel(fidx, lidx)
			_send_success(req_id, {"cleared": true})
			
		"palette.create":
			var pname = str(cmd_data.get("name", "palette"))
			var colors = cmd_data.get("colors", [])
			var is_glob = bool(cmd_data.get("isGlobal", false))
			controller.create_palette(pname, colors, is_glob)
			_send_success(req_id, {"created": true})
			
		"animation.create_tag":
			var tname = str(cmd_data.get("name", "anim"))
			var ff = int(cmd_data.get("fromFrame", 0))
			var tf = int(cmd_data.get("toFrame", 0))
			var col = str(cmd_data.get("color", "#2ecc71"))
			controller.create_animation_tag(tname, ff, tf, col)
			_send_success(req_id, {"created": true})
			
		"animation.play":
			var fwd = bool(cmd_data.get("forward", true))
			controller.play_animation(fwd)
			_send_success(req_id, {"playing": true})
			
		"animation.stop":
			controller.stop_animation()
			_send_success(req_id, {"stopped": true})
			
		"cursor.set":
			if queue and queue.cursor_overlay:
				var cx = int(cmd_data.get("x", 0))
				var cy = int(cmd_data.get("y", 0))
				var ctool = str(cmd_data.get("tool", "Pencil"))
				var ccol = Color.from_string(str(cmd_data.get("color", "#ffffff")), Color.WHITE)
				var cstage = str(cmd_data.get("stage", "Drawing"))
				var cmsg = str(cmd_data.get("message", ""))
				queue.cursor_overlay.set_cursor(Vector2i(cx, cy), ctool, ccol, cstage, cmsg)
			_send_success(req_id, {"cursor": true})
			
		"cursor.visibility":
			if queue and queue.cursor_overlay:
				var vis = bool(cmd_data.get("visible", true))
				queue.cursor_overlay.set_overlay_visible(vis)
			_send_success(req_id, {"visibility": true})
			
		"export.png":
			var path = str(cmd_data.get("path", ""))
			var ok = controller.export_png(path)
			_send_success(req_id, {"exported": ok})
			
		"export.spritesheet":
			var path = str(cmd_data.get("path", ""))
			var cols = int(cmd_data.get("columns", 0))
			var rows = int(cmd_data.get("rows", 0))
			var ok = controller.export_spritesheet(path, cols, rows)
			_send_success(req_id, {"exported": ok})
			
		"history.undo":
			controller.undo()
			_send_success(req_id, {"undone": true})
			
		"history.redo":
			controller.redo()
			_send_success(req_id, {"redone": true})
			
		_:
			_send_error(req_id, "COMMAND_UNKNOWN", "Unknown command: " + cmd_name)

func _send_success(req_id: String, data: Dictionary) -> void:
	send_json({
		"id": req_id,
		"success": true,
		"data": data
	})

func _send_error(req_id: String, code: String, msg: String) -> void:
	send_json({
		"id": req_id,
		"success": false,
		"error": {
			"code": code,
			"message": msg
		}
	})
