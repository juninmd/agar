from playwright.sync_api import sync_playwright
import time

def verify_viral():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to game...")
        page.goto("http://localhost:8000")

        # 1. Select VIRAL Protocol
        print("Selecting VIRAL protocol...")
        page.wait_for_selector('.protocol-card[data-id="VIRAL"]')
        page.click('.protocol-card[data-id="VIRAL"]')

        # 2. Start Game
        print("Starting game...")
        page.click("#start-btn")

        # Wait for initialization
        time.sleep(1)

        # 3. Cheat to survive
        print("Injecting mass...")
        page.evaluate("window.player.grow(500)")

        # 4. Spawn a test bot nearby
        print("Spawning test bot...")
        page.evaluate("""
            const bot = new window.Bot(window.player.x + 150, window.player.y, 20, '#FFFFFF', 'NORMAL');
            bot.mass = 200; // Ensure it has mass to drain
            window.bots.push(bot);
        """)

        # 5. Trigger Ability (E)
        print("Triggering Ability (E)...")
        page.keyboard.press("e")

        # Wait for visual effect (tethers)
        time.sleep(0.5)

        # 6. Screenshot
        print("Taking screenshot...")
        page.screenshot(path="verify_viral.png")

        browser.close()

if __name__ == "__main__":
    verify_viral()
