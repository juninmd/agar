import pytest
from playwright.sync_api import sync_playwright

def test_game_boots():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for start button
        page.wait_for_selector("#start-btn", state="visible")

        # Start game
        page.click("#start-btn")

        # Wait for game to initialize
        page.wait_for_timeout(1000)

        # Check player protocol
        protocol_id = page.evaluate("window.game.player.protocol.id")
        assert protocol_id == "HACKER", f"Expected HACKER protocol by default, got {protocol_id}"

        browser.close()

if __name__ == "__main__":
    test_game_boots()
    print("verify_refactor.py completed successfully")
