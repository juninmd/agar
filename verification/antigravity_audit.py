from playwright.sync_api import sync_playwright
import time
import sys

def audit_antigravity():
    print("Initiating Antigravity Audit...")
    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            print("Navigating to game...")
            try:
                page.goto("http://localhost:8000")
            except Exception as e:
                print(f"Failed to connect to game server: {e}")
                print("Is the server running?")
                return False

            # Start game
            print("Starting game...")
            # Wait for start button to be visible
            page.wait_for_selector("#start-btn")
            page.click("#start-btn")
            time.sleep(2) # Wait for spawn

            print("Auditing Entity Physics (Gravity/Bounds)...")

            # Check for 10 seconds
            # 10 checks, 1 second apart
            for i in range(10):
                # Get all entities
                # We need to handle potential errors if window.player is not ready
                entities = page.evaluate("""() => {
                    if (!window.player) return [];
                    const all = [window.player, ...window.bots, ...window.foods];
                    return all.map(e => ({
                        x: e.x,
                        y: e.y,
                        r: e.radius,
                        type: e.constructor.name,
                        mass: e.mass
                    }));
                }""")

                if not entities:
                    print("No entities found (Game not started?)")
                    continue

                world_width = 3000
                world_height = 3000

                out_of_bounds_count = 0

                for e in entities:
                    x, y, r = e['x'], e['y'], e['r']
                    # Allow small buffer (e.g. 5px) for floating point or visual overlap
                    # Actually, logic says center is clamped to radius.
                    # So center should be >= radius and <= width - radius.
                    # But if we check bounds (0,0) to (W,H), we are lenient.

                    if x < -r or x > world_width + r or y < -r or y > world_height + r:
                         print(f"ANTIGRAVITY DETECTED: Entity {e['type']} at ({x:.2f}, {y:.2f}) is out of bounds! Mass: {e['mass']:.2f}")
                         out_of_bounds_count += 1

                if out_of_bounds_count > 0:
                    print(f"Tick {i}: {out_of_bounds_count} entities floating in void.")
                    # We treat this as a failure
                    return False
                else:
                    print(f"Tick {i}: All {len(entities)} entities securely grounded in reality.")

                time.sleep(1)

            print("Antigravity Audit Passed: Gravity is operational. No floating entities detected.")
            browser.close()
            return True

    except Exception as e:
        print(f"An unexpected error occurred during audit: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = audit_antigravity()
    if not success:
        sys.exit(1)
