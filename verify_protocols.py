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

        # Immediate bot clear to prevent spawn collisions
        page.evaluate("window.game.bots = []")

        time.sleep(0.5)

        protocol_name = page.evaluate("window.player.protocol.name")
        mass_mult = page.evaluate("window.player.protocol.massMultiplier")
        radius = page.evaluate("window.player.radius")
        expected = CONSTANTS_INITIAL_RADIUS * math.sqrt(2.0)

        print(f"BASTION Protocol: {protocol_name}, MassMult: {mass_mult}, Radius: {radius}, Expected: {expected}")
        assert protocol_name == "BASTION", f"Expected BASTION, got {protocol_name}"
        assert abs(radius - expected) < 2.0, f"BASTION radius mismatch! Got {radius} but expected {expected}"

        # Test PHANTOM
        page.reload()
        print("Testing PHANTOM protocol...")
        page.click('.protocol-card[data-id="PHANTOM"]')
        page.click("#start-btn")

        # Immediate bot clear
        page.evaluate("window.game.bots = []")

        time.sleep(0.5)

        protocol_name = page.evaluate("window.player.protocol.name")
        mass_mult = page.evaluate("window.player.protocol.massMultiplier")
        radius = page.evaluate("window.player.radius")
        expected = CONSTANTS_INITIAL_RADIUS * math.sqrt(0.8)

        print(f"PHANTOM Protocol: {protocol_name}, MassMult: {mass_mult}, Radius: {radius}, Expected: {expected}")
        assert protocol_name == "PHANTOM", f"Expected PHANTOM, got {protocol_name}"
        assert abs(radius - expected) < 2.0, f"PHANTOM radius mismatch! Got {radius}"

        print("Protocol Verification Passed!")
        browser.close()

if __name__ == "__main__":
    verify_protocols()
