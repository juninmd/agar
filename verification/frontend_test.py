from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000")
    page.wait_for_timeout(1000)

    # Click the new ASTRAL protocol card
    page.click(".protocol-card[data-id='ASTRAL']")
    page.wait_for_timeout(500)

    page.click("#start-btn")
    page.wait_for_timeout(2000)

    page.screenshot(path="verification/screenshots/astral_protocol.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    import os
    os.makedirs("verification/videos", exist_ok=True)
    os.makedirs("verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
