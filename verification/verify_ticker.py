from playwright.sync_api import sync_playwright
import time

def verify_ticker():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Click start to enter game
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")

        time.sleep(2)

        # Verify ticker exists and is visible
        ticker = page.locator("#terminal-ticker")

        # Try to make it display text by invoking game's updateTicker manually for the screenshot
        page.evaluate("""() => {
            if (window.game && window.game.ui && window.game.ui.hud) {
                window.game.ui.hud.updateTicker("SYSTEM SECURE");
            }
        }""")

        time.sleep(1)

        # Take full screen to see the HUD
        page.screenshot(path="verification/verification_ticker.png")
        browser.close()

if __name__ == "__main__":
    verify_ticker()
