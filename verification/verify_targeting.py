import time
from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to the game and bypass boot sequence
    page.goto("http://localhost:8000/")

    # Wait for the start screen to be visible
    page.wait_for_selector("#start-btn")

    # Click the start button
    page.click("#start-btn")

    # Let the game run for a few seconds to let bots spawn and targeting system to activate
    print("Waiting for game to initialize and bots to spawn...")
    page.wait_for_timeout(3000)

    print("Taking a screenshot of the targeting diagnostic overlay in action...")
    page.screenshot(path="verification/screenshots/verification_targeting2.png")

    # Wait a bit more to let the video capture the pulsing effect
    page.wait_for_timeout(4000)
    print("Verification complete.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()