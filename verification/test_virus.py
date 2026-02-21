from playwright.sync_api import sync_playwright
import time
import sys

def verify_virus():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate
        try:
            page.goto("http://localhost:8000")
        except Exception as e:
            print(f"Error connecting: {e}")
            sys.exit(1)

        # 2. Start Game
        try:
            page.wait_for_selector("#start-btn", timeout=5000)
            page.click("#start-btn")
        except Exception as e:
             # Try force click if selector issue
             time.sleep(2)
             if page.is_visible("#start-btn"):
                 page.click("#start-btn")
             else:
                 print(f"Could not start game: {e}")
                 sys.exit(1)

        time.sleep(3) # Wait for boot sequence

        # 3. Inject VIRUS PowerUp
        print("Injecting VIRUS...")
        initial_mass = page.evaluate("window.player.mass")

        page.evaluate("""
            const p = window.player;
            const virus = new window.PowerUp(p.x, p.y, 'VIRUS');
            window.game.foods.push(virus);
        """)

        time.sleep(2) # Allow collision to resolve

        # 4. Check Player State
        print("Checking player state...")
        inverted = page.evaluate("window.player.invertedControls")
        current_mass = page.evaluate("window.player.mass")

        print(f"Inverted Controls: {inverted}")
        print(f"Mass Gain: {current_mass - initial_mass}")

        if not inverted:
            print("FAILURE: Player controls NOT inverted.")
            sys.exit(1)

        if current_mass <= initial_mass:
             print("FAILURE: Player mass did NOT increase.")
             sys.exit(1)

        # 5. Check UI Narrative
        print("Checking Narrative HUD...")
        narrative_visible = page.evaluate("""
            document.querySelector('.narrative-toast.glitch') !== null
        """)

        if narrative_visible:
             print("SUCCESS: Narrative toast visible.")
        else:
             print("FAILURE: Narrative toast NOT visible.")
             sys.exit(1)

        print("ALL TESTS PASSED")
        browser.close()

if __name__ == "__main__":
    verify_virus()
