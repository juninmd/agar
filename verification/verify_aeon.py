from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000/?skipBoot=true")
    page.wait_for_timeout(500)

    # Click start
    page.click("#start-btn")
    page.wait_for_timeout(1000)

    # Force player to be AEON by using the global variables directly (they are exposed to window in main.js)
    # Actually let's just trigger the ability manually via page.evaluate
    page.evaluate("""
        window.game.player.abilities.protocolId = 'AEON';
        window.game.player.abilities.currentConfig = { cooldown: 600, duration: 0 };
    """)

    # Trigger ability (set anchor)
    page.keyboard.press("Shift")
    page.wait_for_timeout(500)

    # Move a bit using joystick logic or mouse
    page.mouse.move(800, 600)
    page.wait_for_timeout(1000)

    # Trigger ability again (rewind to anchor)
    page.keyboard.press("Shift")
    page.wait_for_timeout(1000)

    # Take screenshot at the key moment
    page.screenshot(path="/home/jules/verification/screenshots/verification_aeon.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()
