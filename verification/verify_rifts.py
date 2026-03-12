from playwright.sync_api import sync_playwright

def verify_rifts():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Access the game
        page.goto("http://localhost:8000")

        # Ensure we skip boot
        page.evaluate('window.location.href = "?skipBoot=true"')
        page.wait_for_selector('#start-btn', state='visible')

        # Click start
        page.evaluate('if(document.getElementById("start-btn")) { document.getElementById("start-btn").click(); }')
        page.wait_for_timeout(500)

        # Get initial position
        initial_x = page.evaluate('window.game.player.x;')
        initial_y = page.evaluate('window.game.player.y;')

        print(f"Initial Player Position: ({initial_x}, {initial_y})")

        # Force spawn a rift exactly on the player
        page.evaluate('''
            const rift = new window.game.riftSystem.rifts.__proto__.constructor.prototype.constructor(); // Hacky way if not exported to window, but let's just use spawnRift and move it
            window.game.riftSystem.spawnRift();
            const newRift = window.game.riftSystem.rifts[window.game.riftSystem.rifts.length - 1];
            newRift.x = window.game.player.x;
            newRift.y = window.game.player.y;
        ''')

        # Give it a tiny moment for collision loop to pick it up
        page.wait_for_timeout(200)

        # Get new position
        new_x = page.evaluate('window.game.player.x;')
        new_y = page.evaluate('window.game.player.y;')

        print(f"New Player Position: ({new_x}, {new_y})")

        # Assert teleport happened
        if abs(new_x - initial_x) < 5 and abs(new_y - initial_y) < 5:
            print("FAILED: Player did not teleport.")
            browser.close()
            exit(1)

        print("SUCCESS: Player teleported.")
        page.screenshot(path="verification_rift.png")

        browser.close()

if __name__ == "__main__":
    verify_rifts()
