extends Node

var api: Node = null

func get_global() -> Node:
	return get_node_or_null("/root/Global")

func get_open_save() -> Node:
	return get_node_or_null("/root/OpenSave")

func get_export() -> Node:
	return get_node_or_null("/root/Export")

func get_palettes() -> Node:
	return get_node_or_null("/root/Palettes")

func get_current_project():
	var g = get_global()
	return g.current_project if g else null

func create_project(proj_name: String, width: int, height: int, fill_color: Color = Color(0, 0, 0, 0)) -> Dictionary:
	var g = get_global()
	var da = get_node_or_null("/root/DrawingAlgos")
	if g and g.current_project:
		var p = g.current_project
		p.name = proj_name
		p.fill_color = fill_color
		if da:
			da.resize_canvas(width, height, 0, 0)
		for f in range(p.frames.size()):
			for l in range(p.layers.size()):
				clear_cel(f, l)
		return {"name": p.name, "width": p.size.x, "height": p.size.y}
	elif api and api.project:
		var p = api.project.new_project([], proj_name, Vector2(width, height), fill_color)
		return {"name": p.name, "width": p.size.x, "height": p.size.y}
	return {}

func open_project(path: String) -> bool:
	var os = get_open_save()
	if os and FileAccess.file_exists(path):
		os.handle_loading_file(path)
		return true
	return false

func save_project(path: String) -> bool:
	var os = get_open_save()
	var proj = get_current_project()
	if os and proj:
		return os.save_pxo_file(path, false, false, proj)
	return false

func inspect_project() -> Dictionary:
	var proj = get_current_project()
	if not proj:
		return {}
	
	var layers_info = []
	for i in range(proj.layers.size()):
		var l = proj.layers[i]
		layers_info.append({
			"index": i,
			"name": l.name,
			"visible": l.visible,
			"opacity": l.opacity
		})
		
	var frames_info = []
	for i in range(proj.frames.size()):
		var f = proj.frames[i]
		frames_info.append({
			"index": i,
			"duration": f.duration
		})
		
	var tags_info = []
	for t in proj.animation_tags:
		tags_info.append({
			"name": t.name,
			"from": t.from,
			"to": t.to,
			"color": t.color.to_html()
		})
		
	return {
		"name": proj.name,
		"width": proj.size.x,
		"height": proj.size.y,
		"layers": layers_info,
		"frames": frames_info,
		"tags": tags_info,
		"currentFrame": proj.current_frame,
		"currentLayer": proj.current_layer
	}

func select_layer(layer_index: int) -> void:
	var proj = get_current_project()
	if proj and layer_index >= 0 and layer_index < proj.layers.size():
		proj.change_cel(proj.current_frame, layer_index)

func create_layer(layer_name: String, above_layer: int = 0, layer_type: int = 0) -> void:
	if api and api.project:
		api.project.add_new_layer(above_layer, layer_name, layer_type)

func rename_layer(layer_index: int, new_name: String) -> void:
	var proj = get_current_project()
	if proj and layer_index >= 0 and layer_index < proj.layers.size():
		proj.layers[layer_index].name = new_name

func select_frame(frame_index: int) -> void:
	var proj = get_current_project()
	if proj and frame_index >= 0 and frame_index < proj.frames.size():
		proj.change_cel(frame_index, proj.current_layer)

func create_frame(after_frame: int = 0) -> void:
	if api and api.project:
		api.project.add_new_frame(after_frame)

func set_frame_duration(frame_index: int, duration: float) -> void:
	var proj = get_current_project()
	if proj and frame_index >= 0 and frame_index < proj.frames.size():
		proj.frames[frame_index].duration = duration

func get_current_pixel_image() -> Image:
	var proj = get_current_project()
	if not proj:
		return null
	var cel = proj.frames[proj.current_frame].cels[proj.current_layer]
	if cel and cel.has_method("get_image"):
		return cel.get_image()
	return null

func commit_canvas_changes() -> void:
	var proj = get_current_project()
	if not proj:
		return
	var cel = proj.frames[proj.current_frame].cels[proj.current_layer]
	if cel and cel.has_method("update_texture"):
		cel.update_texture()
	var g = get_global()
	if g and g.canvas:
		g.canvas.queue_redraw()

func draw_pixel_list(pixels: Array) -> void:
	var img = get_current_pixel_image()
	if not img:
		return
		
	var w = img.get_width()
	var h = img.get_height()
	
	for p in pixels:
		if typeof(p) == TYPE_ARRAY and p.size() >= 6:
			var px = int(p[0])
			var py = int(p[1])
			if px >= 0 and px < w and py >= 0 and py < h:
				var col = Color8(int(p[2]), int(p[3]), int(p[4]), int(p[5]))
				img.set_pixel(px, py, col)
				
	commit_canvas_changes()

func draw_runs(runs: Array) -> void:
	var img = get_current_pixel_image()
	if not img:
		return
		
	var w = img.get_width()
	var h = img.get_height()
	
	for r in runs:
		if typeof(r) == TYPE_DICTIONARY:
			var py = int(r["y"])
			var x_start = int(r["xStart"])
			var x_end = int(r["xEnd"])
			var col = Color.from_string(str(r["color"]), Color.BLACK)
			
			if py >= 0 and py < h:
				for px in range(maxi(0, x_start), mini(w, x_end + 1)):
					img.set_pixel(px, py, col)
					
	commit_canvas_changes()

func draw_rect(rect_dict: Dictionary, col_str: String, filled: bool = true) -> void:
	var img = get_current_pixel_image()
	if not img:
		return
		
	var col = Color.from_string(col_str, Color.BLACK)
	var rx = int(rect_dict.get("x", 0))
	var ry = int(rect_dict.get("y", 0))
	var rw = int(rect_dict.get("width", 1))
	var rh = int(rect_dict.get("height", 1))
	
	if filled:
		img.fill_rect(Rect2i(rx, ry, rw, rh), col)
	else:
		for x in range(rx, rx + rw):
			img.set_pixel(x, ry, col)
			img.set_pixel(x, ry + rh - 1, col)
		for y in range(ry, ry + rh):
			img.set_pixel(rx, y, col)
			img.set_pixel(rx + rw - 1, y, col)
			
	commit_canvas_changes()

func erase_pixels(pixels: Array) -> void:
	var img = get_current_pixel_image()
	if not img:
		return
	var w = img.get_width()
	var h = img.get_height()
	for p in pixels:
		var px = int(p.get("x", 0))
		var py = int(p.get("y", 0))
		if px >= 0 and px < w and py >= 0 and py < h:
			img.set_pixel(px, py, Color(0, 0, 0, 0))
	commit_canvas_changes()

func clear_cel(frame_index: int = -1, layer_index: int = -1) -> void:
	var proj = get_current_project()
	if not proj:
		return
	var fi = proj.current_frame if frame_index < 0 else frame_index
	var li = proj.current_layer if layer_index < 0 else layer_index
	if fi >= 0 and fi < proj.frames.size() and li >= 0 and li < proj.layers.size():
		var cel = proj.frames[fi].cels[li]
		if cel and cel.has_method("get_image"):
			var img = cel.get_image()
			if img:
				img.fill(Color(0, 0, 0, 0))
				if cel.has_method("update_texture"):
					cel.update_texture()
	var g = get_global()
	if g and g.canvas:
		g.canvas.queue_redraw()

func create_palette(name: String, colors: Array, is_global: bool = false) -> void:
	if api and api.palette:
		var color_data = []
		for i in range(colors.size()):
			var c = Color.from_string(str(colors[i]), Color.BLACK)
			color_data.append({
				"color": "(%s, %s, %s, %s)" % [c.r, c.g, c.b, c.a],
				"index": i
			})
		var dict = {
			"colors": color_data,
			"comment": "AI Generated Palette",
			"width": 8,
			"height": ceili(colors.size() / 8.0)
		}
		api.palette.create_palette_from_data(name, dict, is_global)

func create_animation_tag(name: String, from_frame: int, to_frame: int, col_str: String = "#2ecc71") -> void:
	var proj = get_current_project()
	if not proj:
		return
	var tag_class = load("res://src/Classes/AnimationTag.gd")
	if tag_class:
		var new_tag = tag_class.new(name, Color.from_string(col_str, Color.GREEN), from_frame + 1, to_frame + 1)
		proj.animation_tags.append(new_tag)

func play_animation(forward: bool = true) -> void:
	var g = get_global()
	if g and g.animation_timeline:
		if forward:
			g.animation_timeline.play_forward()
		else:
			g.animation_timeline.play_backwards()

func stop_animation() -> void:
	var g = get_global()
	if g and g.animation_timeline:
		g.animation_timeline.stop()

func get_blended_frame_image(frame_index: int) -> Image:
	var proj = get_current_project()
	if not proj or frame_index < 0 or frame_index >= proj.frames.size():
		return null
	var img = Image.create(proj.size.x, proj.size.y, false, Image.FORMAT_RGBA8)
	img.fill(Color(0, 0, 0, 0))
	for layer_idx in range(proj.layers.size()):
		var layer = proj.layers[layer_idx]
		if not layer.visible:
			continue
		var cel = proj.frames[frame_index].cels[layer_idx]
		if cel and cel.has_method("get_image"):
			var cel_img = cel.get_image()
			if cel_img:
				img.blend_rect(cel_img, Rect2i(Vector2i.ZERO, cel_img.get_size()), Vector2i.ZERO)
	return img

func take_snapshot(frame_index: int = -1) -> Dictionary:
	var proj = get_current_project()
	if not proj:
		return {}
	var fi = proj.current_frame if frame_index < 0 else frame_index
	var img = get_blended_frame_image(fi)
	if not img:
		return {}
	var raw_data = img.get_data()
	var png_buf = img.save_png_to_buffer()
	return {
		"width": img.get_width(),
		"height": img.get_height(),
		"dataBase64": Marshalls.raw_to_base64(raw_data),
		"pngBase64": Marshalls.raw_to_base64(png_buf)
	}

func export_png(path: String) -> bool:
	var proj = get_current_project()
	if not proj:
		return false
	var img = get_blended_frame_image(proj.current_frame)
	if img:
		var err = img.save_png(path)
		return err == OK
	return false

func export_spritesheet(path: String, cols: int = 0, rows: int = 0) -> bool:
	var proj = get_current_project()
	if not proj:
		return false
	var total_frames = proj.frames.size()
	if total_frames == 0:
		return false
		
	var c = cols if cols > 0 else mini(total_frames, 8)
	var r = rows if rows > 0 else ceili(float(total_frames) / float(c))
	
	var sheet_w = c * proj.size.x
	var sheet_h = r * proj.size.y
	
	var sheet = Image.create(sheet_w, sheet_h, false, Image.FORMAT_RGBA8)
	sheet.fill(Color(0, 0, 0, 0))
	
	for i in range(total_frames):
		var frame_img = get_blended_frame_image(i)
		if frame_img:
			var col_idx = i % c
			var row_idx = i / c
			var dst_pos = Vector2i(col_idx * proj.size.x, row_idx * proj.size.y)
			sheet.blit_rect(frame_img, Rect2i(Vector2i.ZERO, frame_img.get_size()), dst_pos)
			
	var err = sheet.save_png(path)
	return err == OK

func undo() -> void:
	var proj = get_current_project()
	if proj and proj.undo_redo:
		proj.undo_redo.undo()

func redo() -> void:
	var proj = get_current_project()
	if proj and proj.undo_redo:
		proj.undo_redo.redo()
