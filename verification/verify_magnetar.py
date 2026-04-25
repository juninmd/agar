import asyncio
from playwright.async_api import async_playwright
import math

async def verify_magnetar():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Start a local server to serve the game
        import subprocess
        server = subprocess.Popen(["python3", "-m", "http.server", "8000"])
        await asyncio.sleep(1) # wait for server

        try:
            await page.goto("http://localhost:8000")

            # Wait for game to initialize
            await page.evaluate("""
                () => {
                    return new Promise(resolve => {
                        if (window.game) resolve();
                        else {
                            const interval = setInterval(() => {
                                if (window.game) {
                                    clearInterval(interval);
                                    resolve();
                                }
                            }, 100);
                        }
                    });
                }
            """)

            # Start game with MAGNETAR protocol
            await page.evaluate("""
                () => {
                    document.getElementById('player-name').value = 'TestMagnetar';

                    // Select MAGNETAR protocol card
                    document.querySelectorAll('.protocol-card').forEach(c => c.classList.remove('selected'));
                    const magnetarCard = document.querySelector('.protocol-card[data-id="MAGNETAR"]');
                    if(magnetarCard) magnetarCard.classList.add('selected');

                    window.selectedProtocolId = 'MAGNETAR'; // the ui.js uses a selectedProtocol variable or data attr

                    document.getElementById('start-btn').click();
                }
            """)

            await asyncio.sleep(0.5)

            # Test 1: Ability Effect (MAGNETAR)
            result_ability = await page.evaluate("""
                () => {
                    const player = window.game.player;
                    const testBot = new window.Bot(player.x + 300, player.y, 20, '#ffffff', 'NORMAL');
                    window.game.bots = [testBot];

                    const initialDist = Math.hypot(player.x - testBot.x, player.y - testBot.y);

                    // Activate MAGNETAR ability
                    player.abilities.activate(player, window.game.bots);

                    // Update a few frames
                    for(let i=0; i<10; i++){
                        player.abilities.update(player, window.game.bots);
                    }

                    const finalDist = Math.hypot(player.x - testBot.x, player.y - testBot.y);
                    return {
                        success: finalDist < initialDist,
                        initialDist,
                        finalDist,
                        isActive: player.abilities.isActive
                    };
                }
            """)

            if result_ability['success']:
                print("✅ MAGNETAR ability successfully pulls entities.")
            else:
                print(f"❌ MAGNETAR ability failed. Initial: {result_ability['initialDist']}, Final: {result_ability['finalDist']}")
                exit(1)

            # Test 2: AI Strategy (LODESTONE)
            result_lodestone = await page.evaluate("""
                () => {
                    const lodestone = new window.Bot(500, 500, 50, '#000', 'LODESTONE');
                    const victim = new window.Bot(800, 500, 20, '#fff', 'NORMAL');

                    window.game.bots = [lodestone, victim];

                    const initialDist = Math.hypot(lodestone.x - victim.x, lodestone.y - victim.y);

                    // Simulate thinking
                    for(let i=0; i<10; i++){
                        // lodestone.update signature: update(worldWidth, worldHeight, entities, foods)
                        lodestone.update(1000, 1000, window.game.bots, window.game.foods);
                        victim.update(1000, 1000, window.game.bots, window.game.foods); // victim needs to update to apply the velocity change
                    }

                    const finalDist = Math.hypot(lodestone.x - victim.x, lodestone.y - victim.y);
                    return {
                        success: finalDist < initialDist,
                        initialDist,
                        finalDist
                    };
                }
            """)

            if result_lodestone['success']:
                print("✅ LODESTONE bots successfully pull entities.")
            else:
                print(f"❌ LODESTONE AI failed. Initial: {result_lodestone['initialDist']}, Final: {result_lodestone['finalDist']}")
                exit(1)

            print("🚀 Phase 19: The Magnetic Pole perfectly verified.")

        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_magnetar())
