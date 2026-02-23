import asyncio
from playwright.async_api import async_playwright
import sys
import os

# Ensure we can import utils if needed, or just keep it simple
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            await page.goto("http://localhost:8000?skipBoot=true")
        except:
            print("Error loading game. Make sure server is running.")
            sys.exit(1)

        await page.wait_for_selector("#gameCanvas")

        print("Starting game with CYPHER protocol...")
        # Inject code to start game immediately if not already started
        await page.evaluate("""
            if (!window.game || !window.game.gameRunning) {
                window.game.start('Tester', 'CYPHER');
            }
        """)

        await page.wait_for_timeout(1000)

        protocol_id = await page.evaluate("window.player.protocol.id")
        print(f"Player Protocol: {protocol_id}")

        if protocol_id != "CYPHER":
            # Retry setting protocol
            print("Retrying protocol set...")
            await page.evaluate("window.game.start('Tester', 'CYPHER')")
            await page.wait_for_timeout(500)
            protocol_id = await page.evaluate("window.player.protocol.id")
            if protocol_id != "CYPHER":
                print("FAILED: Protocol is not CYPHER")
                sys.exit(1)

        print("Triggering Ability...")
        await page.evaluate("window.player.triggerAbility(window.bots)")

        # Wait for the update loop to process the ability
        await page.wait_for_timeout(500)

        speed_boost = await page.evaluate("window.player.speedBoost")
        print(f"Player Speed Boost: {speed_boost}")

        if speed_boost < 1.5:
            print(f"FAILED: Player speed boost {speed_boost} < 1.5")
            sys.exit(1)

        print("SUCCESS: CYPHER protocol and ability verified.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
