import pytest
from playwright.sync_api import sync_playwright

def test_breaker_protocol():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for start button
        page.wait_for_selector("#start-btn", state="visible")

        # Select BREAKER protocol
        page.evaluate("document.querySelector('.protocol-card[data-id=\"BREAKER\"]').click()")

        # Start game
        page.click("#start-btn")

        # Wait for game to initialize
        page.wait_for_timeout(1000)

        # Check player protocol
        protocol_id = page.evaluate("window.game.player.protocol.id")
        assert protocol_id == "BREAKER", f"Expected BREAKER protocol, got {protocol_id}"

        # Trigger ability (E key)
        page.keyboard.press("e")

        page.wait_for_timeout(100)

        # Check breakerAura active
        aura_active = page.evaluate("window.game.player.breakerAura")
        assert aura_active is True, "breakerAura was not set to true after activation"

        # Check TANK spawn ability
        # Since TANK is randomly spawned, we'll manually inject one to verify collision mass multiplier logic
        mass_before = page.evaluate("window.game.player.mass")

        page.evaluate("""
            const tank = new window.Bot(window.game.player.x, window.game.player.y, 10, '#8B4513', 'TANK');
            tank.mass = 100;
            tank.radius = 1;
            tank.id = "test_tank";
            window.game.bots.push(tank);
        """)

        # Let the game loop process the collision
        page.wait_for_timeout(100)
        page.evaluate("""
            window.game.update();
        """)

        mass_after = page.evaluate("window.game.player.mass")

        # Normal mass gain = 100. With breaker aura = 100 * 1.5 = 150
        mass_gained = mass_after - mass_before
        assert mass_gained >= 150, f"Expected to gain at least 150 mass due to breakerAura, but gained {mass_gained}"

        # Also verify TANK bot was added and has AI logic (we can just verify type logic in js but we successfully pushed it and it was consumed)

        browser.close()

if __name__ == "__main__":
    test_breaker_protocol()
    print("verify_breaker.py completed successfully")
