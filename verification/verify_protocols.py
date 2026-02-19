from playwright.sync_api import sync_playwright
import time
import math

CONSTANTS_INITIAL_RADIUS = 20

def verify_protocols():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test BASTION
        page.goto("http://localhost:8000")
        print("Testing BASTION protocol...")
        page.click('.protocol-card[data-id="BASTION"]')
        page.click("#start-btn")
        page.evaluate("window.game.bots = []")
        time.sleep(0.5)
        protocol_name = page.evaluate("window.player.protocol.name")
        radius = page.evaluate("window.player.radius")
        expected = CONSTANTS_INITIAL_RADIUS * math.sqrt(2.0)
        assert protocol_name == "BASTION"
        assert abs(radius - expected) < 2.0
        print("BASTION OK")

        # Test VIRAL
        page.reload()
        print("Testing VIRAL protocol...")
        page.click('.protocol-card[data-id="VIRAL"]')
        page.click("#start-btn")
        page.evaluate("window.game.bots = []")
        time.sleep(0.5)
        protocol_name = page.evaluate("window.player.protocol.name")
        radius = page.evaluate("window.player.radius")
        expected = CONSTANTS_INITIAL_RADIUS * math.sqrt(0.5)
        assert protocol_name == "VIRAL"
        assert abs(radius - expected) < 2.0
        print("VIRAL OK")

        browser.close()

if __name__ == "__main__":
    verify_protocols()
