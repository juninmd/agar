import asyncio
from playwright.async_api import async_playwright
import sys

async def verify_swarm():
    print("🚀 [SWARM] Starting verification of SWARM Protocol...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Load page
            await page.goto("http://localhost:8000")
            await asyncio.sleep(2)
            await page.evaluate("if(document.getElementById('skip-boot-btn')) document.getElementById('skip-boot-btn').click()")
            await asyncio.sleep(1)

            # Select SWARM and start game
            print("selecting SWARM...")
            await page.evaluate('''() => {
                document.querySelectorAll('.protocol-card').forEach(c => c.classList.remove('selected'));
                const swarmCard = document.querySelector('[data-id="SWARM"]');
                if (swarmCard) swarmCard.classList.add('selected');
                document.getElementById('start-btn').click();
            }''')

            await asyncio.sleep(1)

            print("verifying player protocol...")
            protocol_id = await page.evaluate("window.game.player.protocol.id")
            if protocol_id != 'SWARM':
                print(f"❌ FAILED: Protocol is {protocol_id}, expected SWARM")
                await browser.close()
                sys.exit(1)
            print("✅ Player spawned as SWARM")

            # Check ability activation
            print("Testing SWARM ability (drone spawning)...")
            # Give player enough mass to spawn drones
            await page.evaluate("window.game.player.mass = 1000;")

            # Initial bots count
            initial_bots_count = await page.evaluate("window.game.bots.length")

            # Trigger ability
            await page.evaluate("window.game.player.triggerAbility(window.game.bots);")
            await asyncio.sleep(1)

            # Check drones
            drones_count = await page.evaluate('''() => {
                return window.game.bots.filter(b => b.type === 'DRONE' && b.swarmOwner === window.game.player).length;
            }''')

            if drones_count == 5:
                print("✅ [SWARM] Spawned exactly 5 drones.")
            else:
                print(f"❌ FAILED: Expected 5 drones, found {drones_count}.")
                await browser.close()
                sys.exit(1)

        except Exception as e:
            print(f"❌ Exception occurred: {e}")
            await browser.close()
            sys.exit(1)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_swarm())
