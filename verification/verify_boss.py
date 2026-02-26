import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        print("Navigating to http://localhost:8000...")
        try:
            await page.goto("http://localhost:8000")
        except Exception as e:
            print(f"Error connecting: {e}")
            await browser.close()
            return

        # Start Game
        await page.click("#start-btn")
        await page.wait_for_timeout(1000)

        # Force Spawn Boss
        print("Injecting Boss...")
        result = await page.evaluate("""() => {
            if (!window.game) return { success: false, reason: "No game object" };
            window.game.bossSystem.spawnBoss(window.game.player);
            const boss = window.game.bossSystem.activeBoss;
            if (!boss) return { success: false, reason: "Boss not in activeBoss" };

            return {
                success: true,
                boss: {
                    type: boss.type,
                    mass: boss.mass,
                    color: boss.color,
                    aiState: boss.aiState
                },
                inBotsArray: window.game.bots.some(b => b.type === 'SENTINEL')
            };
        }""")

        if not result['success']:
            print(f"❌ Boss spawn failed: {result['reason']}")
            exit(1)

        boss_data = result['boss']
        print(f"✅ Boss Spawned: {boss_data}")

        assert boss_data['type'] == 'SENTINEL'
        assert boss_data['mass'] == 5000
        assert boss_data['color'] == '#FF0000'
        assert result['inBotsArray'] == True

        print("✅ ALL CHECKS PASSED")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
