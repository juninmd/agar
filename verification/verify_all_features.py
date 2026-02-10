import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    if not os.path.exists("verification"):
        os.makedirs("verification")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 720})

        try:
            # 1. Start Screen
            await page.goto("http://localhost:8000")
            await page.wait_for_selector("#start-screen")
            await page.screenshot(path="verification/start_screen.png")
            print("Captured start_screen.png")

            # 2. Select Protocol & Start
            # Click HACKER card
            await page.click(".protocol-card[data-id='HACKER']")
            await page.click("#start-btn")
            await page.wait_for_timeout(1000) # Wait for game init

            # 3. Capture HUD
            await page.screenshot(path="verification/game_hud.png")
            print("Captured game_hud.png")

            # 4. Trigger Ability (E key)
            await page.keyboard.press("KeyE")
            await page.wait_for_timeout(500) # Wait for effect
            await page.screenshot(path="verification/ability_active.png")
            print("Captured ability_active.png")

            # 5. Simulate Lore Popup
            # We access the UI manager via window.game.ui
            await page.evaluate("window.game.ui.showLorePopup('TEST LOG: SYSTEM AWAKENING SUCCESSFUL.')")
            await page.wait_for_timeout(500) # Wait for animation
            await page.screenshot(path="verification/lore_popup.png")
            print("Captured lore_popup.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
