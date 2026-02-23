import asyncio
from playwright.async_api import async_playwright
import sys
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Do NOT skip boot
            await page.goto("http://localhost:8000")
        except:
            print("Error loading game. Make sure server is running.")
            sys.exit(1)

        # Wait for boot sequence lines
        try:
            # Wait for at least one line
            await page.wait_for_selector(".boot-line", timeout=5000)
            # Wait a bit for more lines
            await page.wait_for_timeout(2000)
            await page.screenshot(path="verification/boot_screen_v2.png")
            print("Boot Screen captured.")
        except Exception as e:
            print(f"Boot screen capture failed: {e}")

        # Skip boot and wait for start screen
        await page.keyboard.press("Enter")
        # Start screen usually has "start-btn" or similar input
        try:
            await page.wait_for_selector("#name-input", timeout=5000)
            await page.screenshot(path="verification/start_screen_v2.png")
            print("Start Screen captured.")
        except Exception as e:
             print(f"Start screen capture failed: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
