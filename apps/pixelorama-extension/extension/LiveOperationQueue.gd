extends Node

var controller: Node = null
var cursor_overlay: Node2D = null
var current_mode := "live"
var is_paused := false
var is_stopped := false

signal operation_progress(op_id: String, current: int, total: int, stage: String)

func execute_draw_pixels(op_id: String, pixels: Array, mode: String = "live") -> void:
	if not controller:
		return
		
	var total = pixels.size()
	if total == 0:
		return
		
	if mode == "instant" or is_stopped:
		controller.draw_pixel_list(pixels)
		return
		
	var batch_size = 8 if mode == "live" else 64
	var i = 0
	
	while i < total:
		if is_stopped:
			break
			
		while is_paused:
			await get_tree().create_timer(0.1).timeout
			if is_stopped:
				break
				
		var batch = pixels.slice(i, mini(i + batch_size, total))
		controller.draw_pixel_list(batch)
		
		if cursor_overlay and batch.size() > 0:
			var last_px = batch[-1]
			var pos = Vector2i(int(last_px[0]), int(last_px[1]))
			var col = Color8(int(last_px[2]), int(last_px[3]), int(last_px[4]), int(last_px[5]))
			cursor_overlay.set_cursor(pos, "Pencil", col, "Drawing")
			
		i += batch_size
		operation_progress.emit(op_id, mini(i, total), total, "Drawing")
		
		if mode == "live":
			await get_tree().process_frame

func execute_draw_runs(op_id: String, runs: Array, mode: String = "live") -> void:
	if not controller:
		return
		
	var total = runs.size()
	if total == 0:
		return
		
	if mode == "instant" or is_stopped:
		controller.draw_runs(runs)
		return
		
	for i in range(total):
		if is_stopped:
			break
			
		while is_paused:
			await get_tree().create_timer(0.1).timeout
			if is_stopped:
				break
				
		var r = runs[i]
		controller.draw_runs([r])
		
		if cursor_overlay and typeof(r) == TYPE_DICTIONARY:
			var pos = Vector2i(int(r.get("xEnd", 0)), int(r.get("y", 0)))
			var col = Color.from_string(str(r.get("color", "#ffffff")), Color.WHITE)
			cursor_overlay.set_cursor(pos, "Pencil", col, "Drawing")
			
		operation_progress.emit(op_id, i + 1, total, "Drawing")
		
		if mode == "live":
			await get_tree().process_frame
