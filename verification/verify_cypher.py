from playwright.sync_api import sync_playwright
import time
import sys

def verify_cypher():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to game...")
            page.goto("http://localhost:8000?skipBoot=true")
        except Exception as e:
            print(f"Error loading game: {e}")
            sys.exit(1)

        # Wait for game to load
        page.wait_for_selector("#start-btn")

        # Select CYPHER protocol
        print("Selecting CYPHER protocol...")
        page.click(".protocol-card[data-id='CYPHER']")

        # Start Game
        print("Starting game...")
        page.click("#start-btn")

        # Wait for game initialization
        time.sleep(1)

        # Verify Protocol
        protocol_id = page.evaluate("window.game.player.protocol.id")
        print(f"Current Protocol: {protocol_id}")
        if protocol_id != "CYPHER":
            print("FAILED: Protocol is not CYPHER")
            sys.exit(1)

        # Trigger Ability (Press 'E')
        print("Triggering Ability (E key)...")
        page.keyboard.press("e")
        time.sleep(0.5)

        # Verify Speed Boost
        speed_boost = page.evaluate("window.game.player.speedBoost")
        print(f"Player Speed Boost: {speed_boost}")
        if speed_boost < 1.5:
            print(f"FAILED: Player speed boost {speed_boost} < 1.5")
            sys.exit(1)

        # Verify Bot Slowdown
        # We need to find at least one bot
        bot_slowed = page.evaluate("""
            () => {
                const bot = window.game.bots.find(b => b.debugWasSlowed);
                return bot ? true : false;
            }
        """)

        # Note: If no bots are nearby, this might fail, but ability affects ALL bots in current logic?
        # Let's check AbilitySystem.js: "bots.forEach(b => b.isSlowed = true);" -> Yes, global effect for CYPHER?
        # In ability_system.js: "bots.forEach(b => b.isSlowed = true);"
        # Wait, usually ability takes `bots` as argument. In Game.js: "this.player.triggerAbility(this.bots);"
        # So yes, it affects all bots in the `bots` array.

        print(f"Bot Slowed: {bot_slowed}")
        if not bot_slowed:
            print("FAILED: No bots were slowed.")
            sys.exit(1)

        print("Taking screenshot...")
        page.screenshot(path="verification/verify_cypher.png")

        print("SUCCESS: CYPHER protocol verified.")
        browser.close()

if __name__ == "__main__":
    verify_cypher()
