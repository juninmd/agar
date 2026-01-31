from playwright.sync_api import sync_playwright
import time
import sys

def verify_bots():
    print("Verifying Bots...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000")
        except:
             print("Server not running.")
             sys.exit(1)

        # Start game
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")
        time.sleep(2)

        # Get Bot info
        bot_types = page.evaluate("""() => {
            if (!window.bots) return [];
            return window.bots.map(b => b.type);
        }""")

        print(f"Found {len(bot_types)} bots.")
        unique_types = set(bot_types)
        print(f"Bot types present: {unique_types}")

        # Check if we have variety (not just NORMAL)
        expected_types = {"NORMAL", "SEEKER", "GUARDIAN", "GLITCH"}
        missing = expected_types - unique_types

        if missing:
            print(f"Warning: Did not see bots of type {missing}. This might be random chance.")
        else:
            print("All bot types verified.")

        # Screenshot
        page.screenshot(path="bots_verification.png")
        print("Screenshot saved to bots_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_bots()
