import sys
from playwright.sync_api import sync_playwright

def test_skins():
    """
    Verifies that the skin selector works correctly in the frontend UI,
    starts the game properly, and applies the selected skin to the player instance.
    """
    print("Running Skins & Cosmetics System UI Tests...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000?skipBoot=true")
        except:
            print("Error: Game server not running at localhost:8000")
            sys.exit(1)

        # Use force=True for click if it's visually hidden due to testing environments
        page.wait_for_selector("#start-screen", state="attached")

        # Check if the skin selector exists
        skin_selector = page.locator("#skin-selector")
        if not skin_selector.is_visible():
            print("Error: #skin-selector not found in UI")
            sys.exit(1)

        # Select a skin
        skin_selector.select_option("MATRIX")
        print("[OK] Selected MATRIX skin")

        # Start game
        page.locator("#start-btn").click()
        page.wait_for_selector("#start-screen", state="hidden", timeout=3000)

        # Check the player's skin property in the game state
        skin_value = page.evaluate("window.game.player.skin")
        if skin_value != "MATRIX":
            print(f"Error: Expected player skin to be MATRIX, but got {skin_value}")
            sys.exit(1)

        print("[OK] Game started successfully and player skin is correctly set.")
        browser.close()

if __name__ == "__main__":
    test_skins()
    print("verify_skins.py completed successfully")
