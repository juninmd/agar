import asyncio
from playwright.async_api import async_playwright
import sys

async def verify_omni():
    print("🚀 [OMNI] Starting verification of OMNI Protocol Awakening...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Load page
            await page.goto("http://localhost:8000")
            await asyncio.sleep(2) # wait for boot to finish or handle skip
            await page.evaluate("if(document.getElementById('skip-boot-btn')) document.getElementById('skip-boot-btn').click()")
            await asyncio.sleep(1)

            # Inject 34 fragments to unlock OMNI
            print("injecting lore...")
            await page.evaluate('''() => {
                for (let i = 1; i <= 34; i++) {
                    window.loreSystem.unlock(i);
                }
                // Need to manually call check again after unlock for the UI to update
                // because main only does it on init.
                const omniCard = document.getElementById('omni-protocol-card');
                if (omniCard) omniCard.classList.remove('hidden');
            }''')
            await asyncio.sleep(1)

            # Select OMNI and start game
            print("selecting omni...")
            await page.evaluate('''() => {
                document.querySelectorAll('.protocol-card').forEach(c => c.classList.remove('selected'));
                const omniCard = document.getElementById('omni-protocol-card');
                if (omniCard) omniCard.classList.add('selected');
                document.getElementById('start-btn').click();
            }''')

            await asyncio.sleep(1)

            print("verifying player protocol...")
            protocol_id = await page.evaluate("window.game.player.protocol.id")
            if protocol_id != 'OMNI':
                print(f"❌ FAILED: Protocol is {protocol_id}, expected OMNI")
                await browser.close()
                sys.exit(1)
            print("✅ Player spawned as OMNI")

            # Force true win by removing all bots
            print("forcing win...")
            await page.evaluate('''() => {
                window.game.bots = [];
            }''')

            await asyncio.sleep(1)

            # Check true win screen visibility
            is_true_win_visible = await page.evaluate('''() => {
                const screen = document.getElementById('true-win-screen');
                return screen && !screen.classList.contains('hidden');
            }''')

            if is_true_win_visible:
                print("✅ [OMNI] True Win screen displayed successfully.")
            else:
                print("❌ FAILED: True Win screen not visible.")
                await browser.close()
                sys.exit(1)

        except Exception as e:
            print(f"❌ Exception occurred: {e}")
            await browser.close()
            sys.exit(1)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_omni())