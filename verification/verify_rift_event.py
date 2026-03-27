from playwright.sync_api import sync_playwright
import time

def run_cuj(page):
    page.goto("http://localhost:8000")
    page.wait_for_timeout(500)

    # Skip boot
    page.evaluate('window.location.href = "?skipBoot=true"')
    page.wait_for_selector('#start-btn', state='visible')

    # Start
    page.evaluate('if(document.getElementById("start-btn")) { document.getElementById("start-btn").click(); }')
    page.wait_for_timeout(500)

    # Trigger Rift Storm directly
    page.evaluate('window.game.riftSystem.triggerRiftStorm();')

    # Wait for the storm to pull things and show the narrative UI
    page.wait_for_timeout(2000)

    # Take screenshot of the event
    page.screenshot(path="verification_rift_storm.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification_videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
