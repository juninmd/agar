from playwright.sync_api import sync_playwright

def verify_rift_unit():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Access the game
        page.goto("http://localhost:8000")

        # Wait for the script to load
        page.wait_for_selector('#start-btn', state='visible')

        print("Testing Rift initialization and update...")
        # Spawning a Rift naturally to test it
        page.evaluate('''
            window.game.riftSystem.spawnRift();
            window._testRift = window.game.riftSystem.rifts[0];
        ''')

        # Test initialization values
        rift_type = page.evaluate('window._testRift.type;')
        rift_radius = page.evaluate('window._testRift.radius;')
        rift_rotation = page.evaluate('window._testRift.rotation;')

        assert rift_type == 'RIFT', f"Expected type 'RIFT', got {rift_type}"
        assert rift_radius == 60, f"Expected radius 60, got {rift_radius}"
        assert rift_rotation == 0, f"Expected initial rotation 0, got {rift_rotation}"

        # Test update logic (rotation increase)
        page.evaluate('window._testRift.update();')
        new_rotation = page.evaluate('window._testRift.rotation;')
        assert new_rotation > 0, f"Expected rotation to increase after update, got {new_rotation}"

        print("Rift unit tests passed.")

        print("Testing RiftSystem...")
        # Test RiftSystem spawning and max limits
        page.evaluate('''
            window.game.riftSystem.reset();
            window.game.riftSystem.spawnRift();
            window.game.riftSystem.spawnRift();
            window.game.riftSystem.spawnRift();
            window.game.riftSystem.spawnRift(); // 4th spawn
        ''')

        # Test max rifts limit is respected in update
        # Simulate timer pass and update to trigger spawn check
        page.evaluate('''
            window.game.riftSystem.reset();
            window.game.riftSystem.spawnTimer = 1000;
            window.game.riftSystem.update(window.game);
        ''')
        rifts_length = page.evaluate('window.game.riftSystem.rifts.length;')
        assert rifts_length == 1, f"Expected 1 rift spawned, got {rifts_length}"

        # Test resetting
        page.evaluate('window.game.riftSystem.reset();')
        rifts_length_after_reset = page.evaluate('window.game.riftSystem.rifts.length;')
        assert rifts_length_after_reset == 0, f"Expected 0 rifts after reset, got {rifts_length_after_reset}"

        print("RiftSystem unit tests passed.")

        browser.close()

if __name__ == "__main__":
    verify_rift_unit()
