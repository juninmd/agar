from playwright.sync_api import sync_playwright
import time

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # make it a bigger window to see the modal
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        # Spoof webdriver flag to bypass bot detection on start screen
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false})")

        # Also use skipBoot=true query parameter to bypass initial boot animations which can cause timeouts
        page.goto("http://localhost:8000/?skipBoot=true")

        # Wait for the database button and click it
        page.wait_for_selector("#database-btn", state="visible")
        page.wait_for_timeout(1000)

        # Click the button natively since the UI overlays might block it
        page.evaluate("document.getElementById('database-btn').click()")

        # Wait for the modal content to appear
        page.wait_for_selector(".modal-content", state="visible")
        page.wait_for_timeout(2000)

        # take the screenshot of the whole page
        page.screenshot(path="verification/full_screen8.png")
        print("Screenshot captured at verification/full_screen8.png")

        browser.close()

if __name__ == "__main__":
    verify_ui()
