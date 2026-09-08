extends PanelContainer

var bridge_client: Node = null
var queue: Node = null

@onready var status_label: Label = %StatusLabel
@onready var task_label: Label = %TaskLabel
@onready var stage_label: Label = %StageLabel
@onready var progress_bar: ProgressBar = %ProgressBar

@onready var pause_btn: Button = %PauseBtn
@onready var resume_btn: Button = %ResumeBtn
@onready var stop_btn: Button = %StopBtn
@onready var undo_btn: Button = %UndoBtn
@onready var cursor_btn: Button = %CursorBtn

func _ready() -> void:
	if bridge_client and is_instance_valid(bridge_client):
		bridge_client.connection_state_changed.connect(_on_connection_changed)
	if queue and is_instance_valid(queue):
		queue.operation_progress.connect(_on_progress)
		
	if pause_btn:
		pause_btn.pressed.connect(_on_pause_pressed)
	if resume_btn:
		resume_btn.pressed.connect(_on_resume_pressed)
	if stop_btn:
		stop_btn.pressed.connect(_on_stop_pressed)
	if undo_btn:
		undo_btn.pressed.connect(_on_undo_pressed)
	if cursor_btn:
		cursor_btn.pressed.connect(_on_cursor_toggle_pressed)

func _on_connection_changed(connected: bool) -> void:
	if status_label:
		status_label.text = "Status: Connected" if connected else "Status: Disconnected"

func _on_progress(_op_id: String, current: int, total: int, stage: String) -> void:
	if stage_label:
		stage_label.text = "Stage: " + stage
	if progress_bar:
		progress_bar.max_value = float(total)
		progress_bar.value = float(current)

func _on_pause_pressed() -> void:
	if queue:
		queue.is_paused = true
	if stage_label:
		stage_label.text = "Stage: Paused"

func _on_resume_pressed() -> void:
	if queue:
		queue.is_paused = false
	if stage_label:
		stage_label.text = "Stage: Resumed"

func _on_stop_pressed() -> void:
	if queue:
		queue.is_stopped = true
	if stage_label:
		stage_label.text = "Stage: Stopped"

func _on_undo_pressed() -> void:
	var g = get_node_or_null("/root/Global")
	if g and g.current_project and g.current_project.undo_redo:
		g.current_project.undo_redo.undo()

func _on_cursor_toggle_pressed() -> void:
	if queue and queue.cursor_overlay:
		var current = queue.cursor_overlay.overlay_visible
		queue.cursor_overlay.set_overlay_visible(not current)
