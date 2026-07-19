import pytest
from playwright.sync_api import sync_playwright

def test_ui_protocol_selection():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for the start screen - the class might be 'overlay active'
        page.wait_for_selector("#start-screen", state="attached")

        # Give it a tiny bit of time for CSS to apply
        page.wait_for_timeout(500)

        # Evaluate the grid properties
        display_style = page.evaluate("window.getComputedStyle(document.getElementById('protocol-selection')).getPropertyValue('display')")
        assert display_style == "grid", f"Expected display to be 'grid', but got '{display_style}'"

        # Check scroll properties
        scrollHeight = page.evaluate("document.getElementById('protocol-selection').scrollHeight")
        clientHeight = page.evaluate("document.getElementById('protocol-selection').clientHeight")

        # Verify that it is scrollable
        assert scrollHeight > clientHeight, f"Expected scrollHeight ({scrollHeight}) to be greater than clientHeight ({clientHeight})"

        print("UI Grid functionality verified successfully!")
        browser.close()

if __name__ == "__main__":
    test_ui_protocol_selection()