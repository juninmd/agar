from playwright.sync_api import sync_playwright
import time

def verify_forge():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("[TEST] Navigating to game...")
        page.goto("http://localhost:8000/?skipBoot=true")
        page.wait_for_selector("#protocol-selection", state="visible")

        print("[TEST] Selecting FORGE protocol...")
        page.click(".protocol-card[data-id='FORGE']")

        page.click("#start-btn")
        time.sleep(1) # Let game initialize

        # Inject some mass and bots
        print("[TEST] Injecting mass and a nearby bot...")
        page.evaluate("""() => {
            window.player.mass = 500;
            const bot = new window.Bot(window.player.x + 100, window.player.y, 50, '#fff', 'NORMAL');
            window.bots.push(bot);
            window.testBot = bot;
        }""")

        bot_state_before = page.evaluate("() => { return { invulnerable: window.testBot.invulnerable }; }")
        print(f"Bot State Before: {bot_state_before}")

        # Trigger Forge ability
        print("[TEST] Triggering Forge ability...")
        page.evaluate("() => { window.player.triggerAbility(window.bots); }")

        time.sleep(0.1) # Wait for state change

        bot_state_after = page.evaluate("() => { return { invulnerable: window.testBot.invulnerable }; }")
        print(f"Bot State After: {bot_state_after}")

        player_mass_after = page.evaluate("() => { return window.player.mass; }")
        print(f"Player Mass After: {player_mass_after}")

        assert bot_state_after["invulnerable"] == True, "Nearby bot was not granted invulnerability shield"
        assert player_mass_after < 500, "Player mass was not deducted for using the Forge ability"

        print("✅ [PASS] Forge Shield verification verified successfully.")

        # Snapshot
        page.screenshot(path="verification_forge.png")

        browser.close()

if __name__ == "__main__":
    verify_forge()
