import pytest
from playwright.sync_api import sync_playwright

def test_hud_hologram_classes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for the HUD elements
        page.wait_for_selector("#integrity-container", state="attached")

        # Verify the digital-noise-panel class is present on HUD elements
        hud_elements = ["#integrity-container", "#score-board", "#leaderboard", "#ability-hud"]

        for selector in hud_elements:
            has_class = page.evaluate(f"document.querySelector('{selector}').classList.contains('digital-noise-panel')")
            assert has_class, f"Element {selector} is missing the 'digital-noise-panel' class"

        print("HUD Hologram verification successful!")
        browser.close()

if __name__ == "__main__":
    test_hud_hologram_classes()