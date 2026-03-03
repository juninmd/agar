from playwright.sync_api import sync_playwright

def verify_firewall():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to local server...")
        page.goto("http://localhost:8000")

        import time
        print("Waiting for start button...")
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")
        print("Clicked start.")

        time.sleep(1)

        # Inject mass and trigger firewall spawn
        print("Injecting mass to trigger firewall...")
        page.evaluate("""
            if (window.game && window.game.player) {
                window.game.player.grow(5000); // 5000 > 4000 limit
                // Force boss system update
                window.game.bossSystem.update(window.game.player);
                // Force UI update to show the alert
                window.game.ui.showCorruptionAlert("TEST FIREWALL ALERT");
                // Move player near the center where the firewall spawns
                window.game.player.x = 200;
                window.game.player.y = 1500;
            }
        """)

        # Wait a moment for rendering
        page.wait_for_timeout(1000)

        print("Taking screenshot...")
        page.screenshot(path="verification/firewall_verification.png")

        # Verify it spawned
        firewall_exists = page.evaluate("""
            window.game ? window.game.bots.some(b => b.type === 'GREAT_FIREWALL') : false
        """)
        print(f"Firewall exists in game state: {firewall_exists}")

        browser.close()

if __name__ == "__main__":
    verify_firewall()