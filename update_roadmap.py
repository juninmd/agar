with open("ROADMAP.md", "r") as f:
    text = f.read()

text += """
## 🔎 Phase 33: The Tactical Zoom (Done)
- [x] **Camera Zoom**: Allow the player to zoom the camera in and out dynamically using the mouse wheel, enhancing situational awareness.
"""

with open("ROADMAP.md", "w") as f:
    f.write(text)

with open("GEMINI.md", "r") as f:
    gemini_text = f.read()

gemini_text = "Action (Spark Persona): Executed Phase 33 \"The Tactical Zoom\" upgrade. Enhanced `InputHandler` with `zoomLevel` manipulated by `wheel` events and integrated scaling inside `Renderer.applyTransform` to allow the player to zoom in and out dynamically without breaking canvas bounds.\n" + gemini_text

with open("GEMINI.md", "w") as f:
    f.write(gemini_text)

with open("AGENTS.md", "r") as f:
    agents_text = f.read()

agents_text = agents_text.replace("- Action (Stitch Persona): Executed Phase 32", "- Action (Spark Persona): Executed Phase 33 \"The Tactical Zoom\" upgrade. Implemented mouse-wheel dynamic zooming via `zoomLevel` integration inside `InputHandler` and `Renderer`.\n- Action (Stitch Persona): Executed Phase 32")

with open("AGENTS.md", "w") as f:
    f.write(agents_text)
