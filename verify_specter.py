import pytest
from playwright.sync_api import sync_playwright

def test_specter_protocol():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for start button
        page.wait_for_selector("#start-btn", state="visible")

        # Select SPECTER protocol
        page.click(".protocol-card[data-id='SPECTER']")

        # Start game
        page.click("#start-btn")

        # Wait for game to initialize
        page.wait_for_timeout(1000)

        # Check player protocol
        protocol_id = page.evaluate("window.game.player.protocol.id")
        assert protocol_id == "SPECTER", f"Expected SPECTER protocol, got {protocol_id}"

        # Trigger ability (E key)
        page.keyboard.press("e")
        page.wait_for_timeout(100)

        # Check intangibility is active
        is_tangible = page.evaluate("window.game.player.isTangible")
        assert is_tangible is False, "Player should be intangible after triggering SPECTER ability"

        # Wait for ability to expire (3 seconds = 180 frames)
        page.wait_for_timeout(3500)

        # Check intangibility is inactive
        is_tangible = page.evaluate("window.game.player.isTangible")
        assert is_tangible is True, "Player should be tangible again after SPECTER ability expires"

        browser.close()

if __name__ == "__main__":
    test_specter_protocol()
    print("verify_specter.py completed successfully")
