import asyncio
from playwright.async_api import async_playwright
import sys

async def verify_swarm_frontend():
    print("🚀 [SWARM FRONTEND] Starting visual verification of SWARM Protocol...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(record_video_dir="verification/videos")
        page = await context.new_page()

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

            # Take screenshot of player as SWARM
            await page.screenshot(path="verification/screenshots/verification_swarm_player.png")

            print("Testing SWARM ability (drone spawning)...")
            # Give player enough mass to spawn drones
            await page.evaluate("window.game.player.mass = 1000;")

            # Trigger ability
            await page.evaluate("window.game.player.triggerAbility(window.game.bots);")
            await asyncio.sleep(2) # Wait for drones to spawn and orbit

            # Take screenshot of swarm
            await page.screenshot(path="verification/screenshots/verification_swarm_drones.png")
            await asyncio.sleep(1)

        except Exception as e:
            print(f"❌ Exception occurred: {e}")
            await context.close()
            await browser.close()
            sys.exit(1)

        await context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_swarm_frontend())
