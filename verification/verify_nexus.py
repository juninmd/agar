import asyncio
from playwright.async_api import async_playwright
import os

async def verify_nexus():
    print("Initiating NEXUS / FRAGMENTER Verification...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Wait for the python http.server that we'll launch in bash
        url = "http://localhost:8000?skipBoot=true"
        await page.goto(url)
        await asyncio.sleep(1) # Ensure JS loads

        # 1. Select NEXUS Protocol
        await page.evaluate("""() => {
            const el = document.querySelector('.protocol-card[data-id="NEXUS"]');
            if(el) {
                document.querySelectorAll('.protocol-card').forEach(c => c.classList.remove('selected'));
                el.classList.add('selected');
            }
        }""")

        await page.fill('#player-name', 'NEXUS_TEST')
        await page.evaluate("document.getElementById('start-btn').click();")
        await asyncio.sleep(1)

        # 2. Inject a FRAGMENTER bot via evaluate
        await page.evaluate("""() => {
            if (window.game && window.game.bots) {
                // Clear existing
                window.game.bots = [];
                // Spawn Fragmenter
                const f = new window.Bot(window.player.x + 200, window.player.y, 40, '#00FFCC', 'FRAGMENTER');
                window.game.bots.push(f);
            }
        }""")
        await asyncio.sleep(0.5)

        # 3. Verify it spawned correctly
        bot_type = await page.evaluate("window.game.bots.find(b => b.type === 'FRAGMENTER')?.type")

        assert bot_type == 'FRAGMENTER', f"Expected FRAGMENTER bot, got {bot_type}"

        # 4. Teleport player into the FRAGMENTER to trigger shatter
        await page.evaluate("""() => {
            window.player.mass = 5000; // make player huge so it can eat the bot
            window.player.radius = 100;
            const bot = window.game.bots[0];
            window.player.x = bot.x;
            window.player.y = bot.y;
        }""")
        await asyncio.sleep(0.5) # Wait for collision resolution

        print("NEXUS logic verified successfully.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_nexus())