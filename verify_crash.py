from playwright.sync_api import sync_playwright
import time

def verify_crash():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Enable console logging
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        try:
            page.goto("http://localhost:8000")
            page.click("#start-btn")
            time.sleep(1)

            print("Setting mass to 6000 to trigger critical phase...")
            page.evaluate("window.game.player.mass = 6000")

            # Allow update loop to process phase 1 -> 2
            time.sleep(1)

            # Phase 2 active. Timer needs 180 frames (approx 3 seconds at 60fps)
            print("Waiting for crash sequence (approx 15s)...")
            time.sleep(15)

            # Check if BSOD is visible
            bsod_visible = page.is_visible("#bsod-screen")
            print(f"BSOD Screen Visible: {bsod_visible}")

            if not bsod_visible:
                # Debug: check class list of bsod
                classes = page.evaluate("document.getElementById('bsod-screen').classList")
                print(f"BSOD Classes: {classes}")

            assert bsod_visible == True, "BSOD screen should be visible!"

            page.screenshot(path="verification_crash.png")
            print("Screenshot taken: verification_crash.png")

        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification_crash_failed.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_crash()
