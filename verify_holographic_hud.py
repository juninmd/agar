import pytest
from playwright.sync_api import sync_playwright

def test_holographic_hud():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for the start screen to be hidden
        page.locator("#start-btn").click()

        # Verify the presence of holographic-hud class on the score-board
        score_board = page.locator("#score-board")
        assert score_board.evaluate("el => el.classList.contains('holographic-hud')")

        # Verify the presence of holographic-hud class on the integrity-container
        integrity_container = page.locator("#integrity-container")
        assert integrity_container.evaluate("el => el.classList.contains('holographic-hud')")

        # Verify the presence of holographic-hud class on the ability-hud
        ability_hud = page.locator("#ability-hud")
        assert ability_hud.evaluate("el => el.classList.contains('holographic-hud')")

        print("Holographic HUD functionality verified successfully!")
        browser.close()

if __name__ == "__main__":
    test_holographic_hud()
