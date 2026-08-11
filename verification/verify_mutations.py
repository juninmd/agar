import asyncio
from playwright.async_api import async_playwright

async def verify_mutations():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8000")

        # Test 1: Active class logic
        # Check initial state
        chaos_btn = page.locator('#mut-chaos').locator('..') # get parent label
        scarcity_btn = page.locator('#mut-scarcity').locator('..')

        await chaos_btn.click()
        await page.wait_for_timeout(200) # give JS time to add class

        # We need to verify that clicking adds the 'active' class
        class_list = await chaos_btn.get_attribute('class')
        assert 'active' in class_list, f"Chaos button missing active class after click. Got: {class_list}"

        await chaos_btn.click()
        await page.wait_for_timeout(200)
        class_list = await chaos_btn.get_attribute('class')
        assert 'active' not in class_list, "Chaos button still has active class after un-click"

        print("✅ UI Event listeners working correctly")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_mutations())
