import pytest
from playwright.sync_api import sync_playwright

def test_ui_rendering():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Override webdriver flag to ensure boot sequence plays
        context = browser.new_context(user_agent="Mozilla/5.0")
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false})")

        page.goto("http://localhost:8000")

        # Wait for the boot screen
        boot_screen = page.locator("#boot-screen")
        boot_screen.wait_for(state="attached", timeout=5000)
        classes = boot_screen.get_attribute("class")

        assert "crt-overlay" in classes
        assert "scanlines" in classes

        # Wait for boot sequence to finish and #start-screen to be active
        page.wait_for_selector("#start-screen.active", state="attached", timeout=15000)

        # Check the title element
        title = page.locator("h1.glitch-text").first
        title_classes = title.get_attribute("class")

        assert "glitch-text" in title_classes

        browser.close()
