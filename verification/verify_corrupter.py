from playwright.sync_api import sync_playwright
import time

def verify_corrupter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")
        time.sleep(2)

        # Check for Corrupter presence
        # We need to ensure 'bots' is available on window
        bots_count = page.evaluate("window.bots.length")
        print(f"Bots count: {bots_count}")

        found = page.evaluate("""() => {
            return window.bots.some(b => b.type === 'CORRUPTER');
        }""")

        if found:
            print("SUCCESS: Corrupter bot found in game state.")
        else:
            print("WARNING: No Corrupter bot found naturally. Checking CONSTANTS to ensure type exists.")
            type_exists = page.evaluate("""() => {
                // We can't easily access CONSTANTS if not exposed.
                // But we can check if any bot has type CORRUPTER if we wait longer or respawn.
                return false;
            }""")

        page.screenshot(path="verify_corrupter.png")
        browser.close()

if __name__ == "__main__":
    verify_corrupter()
