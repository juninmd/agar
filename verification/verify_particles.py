from playwright.sync_api import sync_playwright
import time

def verify_particles():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 720})

        try:
            page.goto("http://localhost:8000")
            page.wait_for_selector("#start-btn")
            page.click("#start-btn")

            # Wait for game to initialize and player to settle
            time.sleep(1)

            # Dash!
            page.keyboard.press("Space")

            # Capture immediately (particles fade fast)
            # Maybe a small delay for render? 100ms
            time.sleep(0.1)

            page.screenshot(path="particles_dash.png")
            print("Screenshot saved to particles_dash.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_particles()
