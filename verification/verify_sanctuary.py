import pytest
from playwright.sync_api import Page, expect

def test_sanctuary_spawn_and_mechanics(page: Page):
    """
    Verifies that Sanctuaries spawn during a purge, repel glitch effects, and heal integrity.
    """
    # 1. Start Game
    page.goto("http://localhost:8000")
    # Wait for the start button to be visible
    page.wait_for_selector("#start-btn")

    # Select protocol and start
    page.fill("#player-name", "TEST_UNIT")
    # Click the first card if specific one not found easily
    page.click(".protocol-card")
    page.click("#start-btn")

    # 2. Wait for game initialization
    page.wait_for_timeout(1000)

    # 3. Access the game instance from window
    # Ensure game is running
    is_running = page.evaluate("window.game.gameRunning")
    assert is_running, "Game should be running"

    # 4. Trigger Purge manually
    # We need to expose game to window. In main.js it does: window.game = game;
    page.evaluate("window.game.purgeSystem.startPurge()")

    # 5. Verify Sanctuaries exist
    sanctuaries = page.evaluate("window.game.purgeSystem.sanctuaries")
    assert len(sanctuaries) > 0, "Sanctuaries should spawn on purge start"

    # Get first sanctuary
    sanctuary = sanctuaries[0]
    sx = sanctuary['x']
    sy = sanctuary['y']
    sr = sanctuary['radius']

    # 6. Teleport Player OUTSIDE Sanctuary
    # Move player far away
    page.evaluate(f"window.game.player.x = {sx} + {sr} + 500")
    page.evaluate(f"window.game.player.y = {sy} + {sr} + 500")

    # Force update to apply effects
    page.evaluate("window.game.update()")

    # Check body class
    # Wait a bit for update loop to process
    page.wait_for_timeout(100)
    has_glitch = page.evaluate("document.body.classList.contains('glitch-mode')")
    assert has_glitch, "Glitch mode should be active outside sanctuary during purge"

    # 7. Teleport Player INSIDE Sanctuary
    page.evaluate(f"window.game.player.x = {sx}")
    page.evaluate(f"window.game.player.y = {sy}")

    # Force update to detect collision
    page.evaluate("window.game.update()")
    page.wait_for_timeout(100) # Wait for class removal

    # 8. Verify Glitch Mode REMOVED
    has_glitch_safe = page.evaluate("document.body.classList.contains('glitch-mode')")
    assert not has_glitch_safe, "Glitch mode should be removed inside sanctuary"

    # 9. Verify System Integrity Healing
    # Set integrity to 50
    page.evaluate("window.game.systemIntegrity = 50")
    page.evaluate("window.game.update()")
    new_integrity = page.evaluate("window.game.systemIntegrity")

    # Since we are inside sanctuary, it should increase by 0.05
    # Outside it decreases by 0.03
    assert new_integrity > 50, f"System Integrity should increase inside sanctuary. Got {new_integrity}"

    print("Sanctuary verification successful!")

if __name__ == "__main__":
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            test_sanctuary_spawn_and_mechanics(page)
        except Exception as e:
            print(f"Test failed: {e}")
            exit(1)
        finally:
            browser.close()
