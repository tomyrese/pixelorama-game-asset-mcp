extends Node2D

var cursor_position := Vector2i(0, 0)
var cursor_tool := "Pencil"
var cursor_color := Color.WHITE
var cursor_stage := "Drawing"
var cursor_message := ""
var overlay_visible := true

func set_cursor(pos: Vector2i, tool_name: String, col: Color, stage: String, msg: String = "") -> void:
	cursor_position = pos
	cursor_tool = tool_name
	cursor_color = col
	cursor_stage = stage
	cursor_message = msg
	queue_redraw()

func set_overlay_visible(vis: bool) -> void:
	overlay_visible = vis
	queue_redraw()

func _draw() -> void:
	if not overlay_visible:
		return
		
	var px_pos = Vector2(cursor_position.x, cursor_position.y)
	var rect = Rect2(px_pos, Vector2(1, 1))
	draw_rect(rect, Color(1.0, 0.2, 0.2, 0.8), false, 0.15)
	
	draw_line(px_pos + Vector2(-1, 0.5), px_pos + Vector2(2, 0.5), Color(1.0, 0.9, 0.2, 0.9), 0.1)
	draw_line(px_pos + Vector2(0.5, -1), px_pos + Vector2(0.5, 2), Color(1.0, 0.9, 0.2, 0.9), 0.1)
	
	var badge_pos = px_pos + Vector2(2, -2)
	draw_rect(Rect2(badge_pos, Vector2(0.8, 0.8)), cursor_color, true)
	draw_rect(Rect2(badge_pos, Vector2(0.8, 0.8)), Color.BLACK, false, 0.08)
