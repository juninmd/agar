from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    # Let's start the game using javascript click since normal click might be intercepted
    page.evaluate("document.getElementById('start-btn').click()")
    page.wait_for_timeout(2000)

    # Take screenshot at the key moment to capture Matrix Rain during gameplay
    page.screenshot(path="/app/verification/verification_matrix_rain.png")
    page.wait_for_timeout(2000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/app/verification/videos"
        )
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false})")
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()
