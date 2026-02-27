from playwright.sync_api import sync_playwright
import time

def verify_raid_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to game...")
        page.goto("http://localhost:8000")
        page.wait_for_selector("#start-btn")

        # Start game
        page.click("#start-btn")
        time.sleep(1)

        print("Forcing Raid Conditions...")
        page.evaluate("window.game.systemIntegrity = 15")
        page.evaluate("window.game.player.mass = 2500")

        # Wait for raid to start and UI to appear
        time.sleep(2)

        # Take screenshot of the warning
        page.screenshot(path="verification/raid_warning.png")
        print("Screenshot saved: verification/raid_warning.png")

        # Wait for minion spawn
        time.sleep(4)

        # Take screenshot of Titan and minions
        page.screenshot(path="verification/raid_titan.png")
        print("Screenshot saved: verification/raid_titan.png")

        browser.close()

if __name__ == "__main__":
    verify_raid_visuals()
