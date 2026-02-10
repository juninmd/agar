import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        try:
            await page.goto("http://localhost:8000", timeout=5000)
        except Exception as e:
            print(f"Error connecting to server: {e}")
            return

        # Test AbilitySystem logic via browser console
        try:
            result = await page.evaluate("""
                async () => {
                    try {
                        const { AbilitySystem } = await import('./js/ability_system.js');
                        const system = new AbilitySystem('BASTION');

                        // Mock Player and Bots
                        const player = { x: 100, y: 100, radius: 20, invulnerable: false };
                        const bot = { x: 150, y: 150, radius: 20, frozen: false };

                        // Test Activation
                        const activated = system.activate(player, [bot]);
                        if (!activated) return "Activation Failed";
                        if (!system.isActive) return "System not active";
                        if (system.protocolId !== 'BASTION') return "Protocol mismatch";

                        // Test Update (Bastion should become invulnerable)
                        system.update(player);
                        if (!player.invulnerable) return "Bastion Shield not active";

                        return "PASS";
                    } catch (e) {
                        return "ERROR: " + e.message;
                    }
                }
            """)
            print(f"Test Result: {result}")
        except Exception as e:
            print(f"Evaluation Error: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
