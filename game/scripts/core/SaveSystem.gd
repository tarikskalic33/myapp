class_name SaveSystemSingleton
extends Node
## Handles Serialization/Deserialization of the GameState to persistent storage.

const SAVE_FILE_PATH: String = "user://system_rebuild_save.json"

## Saves the current GameState data to a JSON file on disk.
func save_game() -> void:
    var save_dict: Dictionary = GameState.serialize()
    var file: FileAccess = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
    if file:
        var json_string: String = JSON.stringify(save_dict, "\t")
        file.store_string(json_string)
        file.close()
        print("SaveSystem: Game saved successfully.")
    else:
        push_error("SaveSystem: Failed to open save file for writing.")

## Loads the GameState data from disk, if it exists.
## Returns true if load was successful, false otherwise.
func load_game() -> bool:
    if not FileAccess.file_exists(SAVE_FILE_PATH):
        print("SaveSystem: No save file found.")
        return false
        
    var file: FileAccess = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
    if file:
        var json_string: String = file.get_as_text()
        file.close()
        
        var json: JSON = JSON.new()
        var error: Error = json.parse(json_string)
        if error == OK:
            var data: Dictionary = json.get_data()
            GameState.deserialize(data)
            print("SaveSystem: Game loaded successfully.")
            return true
        else:
            push_error("SaveSystem: JSON Parse Error at line %d: %s" % [json.get_error_line(), json.get_error_message()])
            return false
    else:
        push_error("SaveSystem: Failed to open save file for reading.")
        return false

## Deletes the save file, useful for hard resets.
func erase_save() -> void:
    if FileAccess.file_exists(SAVE_FILE_PATH):
        var dir: DirAccess = DirAccess.open("user://")
        if dir:
            dir.remove("system_rebuild_save.json")
            print("SaveSystem: Save file erased.")
