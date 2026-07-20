import pytest
from playwright.sync_api import sync_playwright

def test_ui_rendering():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for the start screen to be hidden
        page.locator("#start-btn").click()

        # Verify the presence of neon-glow class on the score-board
        score_board = page.locator("#score-board")
        assert score_board.evaluate("el => el.classList.contains('neon-glow')")

        # Verify the presence of neon-glow class on the integrity-container
        integrity_container = page.locator("#integrity-container")
        assert integrity_container.evaluate("el => el.classList.contains('neon-glow')")

        # Verify the animation properties for uiPulse
        # Need to read the computed style to see if the animation is uiPulse
        animation_name = score_board.evaluate("el => window.getComputedStyle(el).animationName")
        assert "uiPulse" in animation_name, f"Expected uiPulse animation, got {animation_name}"

        print("UI Rendering functionality verified successfully!")
        browser.close()

if __name__ == "__main__":
    test_ui_rendering()
