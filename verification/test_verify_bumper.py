import asyncio
from playwright.async_api import async_playwright

async def verify_bumper_spawning():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8000")

        await page.wait_for_timeout(1000)

        result = await page.evaluate("""
            async () => {
                const constantsModule = await import('./js/constants.js');
                const CONSTANTS = constantsModule.CONSTANTS;
                const types = window.Object.keys(CONSTANTS.BOT_TYPES).filter(k => k !== 'NORMAL' && k !== 'ELITE_HUNTER' && k !== 'SENTINEL');
                return { typesCount: types.length, bumperExists: types.includes('BUMPER') };
            }
        """)

        print(f"Spawner Types check: {result}")
        assert result['bumperExists'] == True, "BUMPER should be in the list of valid random spawn types"

        await browser.close()
        print("✅ BUMPER spawning verified!")

if __name__ == "__main__":
    asyncio.run(verify_bumper_spawning())
