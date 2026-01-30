from playwright.sync_api import sync_playwright
import time

def verify_game():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate
        page.goto("http://localhost:8000")

        # 2. Click Start
        print("Waiting for start button...")
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")
        print("Clicked start.")

        # 3. Wait for game to initialize
        time.sleep(1)

        # 4. Trigger Dash (Space)
        print("Pressing Space...")
        page.keyboard.press("Space")

        # 5. Wait a bit for dash effect/visuals
        time.sleep(0.5)

        # 6. Screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification.png")

        browser.close()

if __name__ == "__main__":
    verify_game()
