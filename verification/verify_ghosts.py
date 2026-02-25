from playwright.sync_api import sync_playwright
import time
import json

def verify_ghosts():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context to ensure localStorage persists (default context is incognito but persistence is handled per session)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to game...")
        try:
            page.goto("http://localhost:8000")
        except Exception as e:
            print(f"Failed to connect: {e}")
            return

        print("Starting game...")
        page.wait_for_selector("#start-btn")

        # Inject custom name to easily identify
        page.fill("#player-name", "GHOST_TEST")
        page.click("#start-btn")

        # Wait for game init
        time.sleep(2)

        # Verify player exists
        player_exists = page.evaluate("!!window.game.player")
        if not player_exists:
            print("ERROR: Player not initialized.")
            browser.close()
            return

        # Force kill player to save ghost
        print("Killing player to save ghost...")
        # Grow mass slightly to ensure it's saved (limit is > 100)
        page.evaluate("window.game.player.mass = 500")
        page.evaluate("window.game.player.markedForDeletion = true")
        # Trigger update loop manually if needed, but loop should be running

        # Wait for game loop to process death
        time.sleep(1)

        # Verify localStorage
        ghosts_json = page.evaluate("localStorage.getItem('neon_phage_ghosts')")
        print(f"LocalStorage content: {ghosts_json}")

        if not ghosts_json:
            print("ERROR: No ghosts found in localStorage.")
            browser.close()
            return

        ghosts = json.loads(ghosts_json)
        if not any(g['name'] == "GHOST_TEST" for g in ghosts):
            print("ERROR: GHOST_TEST not found in saved ghosts.")
            browser.close()
            return

        print("Ghost saved successfully. Restarting game...")

        # Reload page to spawn ghost.
        # Note: In Playwright, reloading the page might clear localStorage if using incognito context without storage state.
        # But 'context' should persist storage within the same session.
        page.reload()
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")

        time.sleep(2)

        # Verify ghost spawned
        ghost_count = page.evaluate("""() => {
            return window.game.bots.filter(b => b.type === 'GHOST').length;
        }""")

        print(f"Found {ghost_count} ghosts spawned.")

        if ghost_count > 0:
            print("SUCCESS: Ghost Protocol Verified!")
        else:
            print("FAILURE: No ghosts spawned.")

        browser.close()

if __name__ == "__main__":
    verify_ghosts()
