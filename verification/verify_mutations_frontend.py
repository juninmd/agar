import asyncio
from playwright.async_api import async_playwright
import os

async def verify_frontend():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8000")

        await page.wait_for_selector("#mutation-toggles")

        # Click a couple buttons to test visual state
        chaos_btn = page.locator('#mut-chaos').locator('..')
        await chaos_btn.click()
        await page.wait_for_timeout(300)

        # Take a screenshot of the mutation toggles area
        mutation_container = page.locator("#mutation-toggles")
        await mutation_container.screenshot(path="verification/mutation_toggles_ui.png")

        print("✅ Screenshot captured to verification/mutation_toggles_ui.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_frontend())
