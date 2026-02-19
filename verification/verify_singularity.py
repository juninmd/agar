from playwright.sync_api import sync_playwright
import time

def verify_singularity():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8000")
        page.click("#start-btn")
        time.sleep(1)

        # Trigger Singularity by hacking mass
        print("Hacking mass to trigger Singularity...")
        page.evaluate("window.game.player.mass = 4500") # 4500 > 5000 * 0.8 (4000)

        # Wait for update loop to catch it
        time.sleep(1)

        # Check singularityActive flag
        is_active = page.evaluate("window.game.singularityActive")
        print(f"Singularity Active: {is_active}")

        assert is_active == True, "Singularity should be active!"

        # Screenshot for visual verification
        page.screenshot(path="verification_singularity.png")
        print("Screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_singularity()
