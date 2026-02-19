from playwright.sync_api import sync_playwright

def verify_sanctuary_visual():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 720})

        try:
            page.goto("http://localhost:8000")
            page.wait_for_selector("#start-btn")
            page.fill("#player-name", "VISUAL_TEST")
            page.click(".protocol-card")
            page.click("#start-btn")
            page.wait_for_timeout(1000)

            # Start Purge
            page.evaluate("window.game.purgeSystem.startPurge()")

            # Get Sanctuary pos
            sanctuaries = page.evaluate("window.game.purgeSystem.sanctuaries")
            if not sanctuaries:
                print("No sanctuaries found!")
                return

            sanctuary = sanctuaries[0]
            sx = sanctuary['x']
            sy = sanctuary['y']

            # Teleport player there
            page.evaluate(f"window.game.player.x = {sx}")
            page.evaluate(f"window.game.player.y = {sy}")

            # Wait for visual update
            page.wait_for_timeout(500)

            # Screenshot
            page.screenshot(path="verification_sanctuary.png")
            print("Screenshot saved to verification_sanctuary.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_sanctuary_visual()
