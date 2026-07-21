import pytest
from playwright.sync_api import sync_playwright

def test_mutations():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for boot sequence to finish (start button becomes available)
        page.wait_for_selector("#start-btn", state="visible")

        # Select Scarcity and Gigantism
        page.locator("#mut-scarcity").check(force=True)
        page.locator("#mut-gigantism").check(force=True)

        # Start game
        page.locator("#start-btn").click(force=True)

        # Wait a moment for the game to start and spawn foods
        page.wait_for_timeout(1000)

        # Check the foods count (Scarcity halves it from 400 to 200)
        food_count = page.evaluate("window.game.foods.length")

        # Check gigantism (Player initial radius is doubled from 20 to 40)
        # Note: Player radius grows over time but starts at INITIAL_RADIUS
        player_radius = page.evaluate("window.game.player.radius")

        # Check if mutations were applied
        assert food_count <= 250, f"SCARCITY not applied, food count is {food_count}"

        # Gigantism check: player mass is calculated via Utils.getMassFromRadius.
        # But wait, we didn't double the mass, we doubled INITIAL_RADIUS.
        # Player constructor uses INITIAL_RADIUS to set its own radius.
        # By the time we measure, it might have grown or shrunk, but it should be way bigger than 20.
        assert player_radius > 30, f"GIGANTISM not applied, player radius is {player_radius}"

        browser.close()

if __name__ == "__main__":
    test_mutations()
    print("verify_mutations.py completed successfully")
