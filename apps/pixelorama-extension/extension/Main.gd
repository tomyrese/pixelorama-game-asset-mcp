extends Node

var api: Node = null
var bridge_client: Node = null
var controller: Node = null
var queue: Node = null
var panel_node: Control = null
var cursor_overlay: Node2D = null

func _ready() -> void:
	api = get_node_or_null("/root/ExtensionsApi")
	
	controller = load("res://src/Extensions/ai_game_asset_studio/PixeloramaController.gd").new()
	controller.name = "PixeloramaController"
	controller.api = api
	add_child(controller)
	
	queue = load("res://src/Extensions/ai_game_asset_studio/LiveOperationQueue.gd").new()
	queue.name = "LiveOperationQueue"
	queue.controller = controller
	add_child(queue)
	
	bridge_client = load("res://src/Extensions/ai_game_asset_studio/BridgeClient.gd").new()
	bridge_client.name = "BridgeClient"
	bridge_client.queue = queue
	bridge_client.controller = controller
	add_child(bridge_client)
	
	var panel_scene: PackedScene = load("res://src/Extensions/ai_game_asset_studio/AIStudioPanel.tscn")
	if panel_scene:
		panel_node = panel_scene.instantiate()
		panel_node.name = "AI Studio"
		panel_node.set("bridge_client", bridge_client)
		panel_node.set("queue", queue)
		if api and api.panel:
			api.panel.add_node_as_tab(panel_node)
	
	var overlay_script = load("res://src/Extensions/ai_game_asset_studio/AICursorOverlay.gd")
	if overlay_script and api and api.general:
		var canvas = api.general.get_canvas()
		if canvas:
			cursor_overlay = Node2D.new()
			cursor_overlay.name = "AICursorOverlay"
			cursor_overlay.set_script(overlay_script)
			canvas.add_child(cursor_overlay)
			queue.cursor_overlay = cursor_overlay

func _exit_tree() -> void:
	if cursor_overlay and is_instance_valid(cursor_overlay):
		cursor_overlay.queue_free()
	if panel_node and is_instance_valid(panel_node) and api and api.panel:
		api.panel.remove_node_from_tab(panel_node)
