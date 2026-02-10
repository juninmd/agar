import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        try:
            await page.goto("http://localhost:8000", timeout=5000)

            # Check if HUD exists
            hud = await page.query_selector("#ability-hud")
            if not hud:
                print("HUD NOT FOUND")
                return

            icon = await page.query_selector("#ability-icon")
            if not icon:
                print("ICON NOT FOUND")
                return

            print("HUD Verified")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
