import asyncio
from playwright.async_api import async_playwright

async def verify_kinetic():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8000")

        await page.wait_for_timeout(1000)

        # We need to make Utils, Spawner, Constants accessible to window manually if not exported globally
        # But wait, looking at the code `window.game` is accessible.
        # Actually, in index.html, let's see how things are imported. Usually as modules.
        # Let's bypass UI start and just use the ability logic directly on a mocked object.

        # Evaluate isolated check
        result = await page.evaluate("""
            async () => {
                // Import the required modules directly via dynamic import
                const utilsModule = await import('./js/utils.js');
                const spawnerModule = await import('./js/spawner.js');
                const abilityEffectsModule = await import('./js/ability_effects.js');
                const collisionModule = await import('./js/collision.js');
                const playerModule = await import('./js/player.js');

                const Utils = utilsModule.Utils;
                const Spawner = spawnerModule.Spawner;
                const AbilityEffects = abilityEffectsModule.AbilityEffects;
                const CollisionSystem = collisionModule.CollisionSystem;
                const Player = playerModule.Player;

                // --- KINETIC TEST ---
                const player = new Player(500, 500, 'KINETIC', 'TestKinetic');
                player.mass = 500;
                player.radius = Utils.getRadiusFromMass(player.mass);

                const bot = Spawner.spawnBot();
                bot.x = player.x + 50;
                bot.y = player.y;
                bot.mass = 100;
                bot.radius = Utils.getRadiusFromMass(bot.mass);

                const bots = [bot];

                const startDistance = Utils.getDistance(player.x, player.y, bot.x, bot.y);

                // Trigger Ability
                const abilitySuccess = AbilityEffects.triggerKinetic(player, bots);

                const botDistance = Utils.getDistance(player.x, player.y, bot.x, bot.y);

                // --- BUMPER TEST ---
                const bot1 = Spawner.spawnBot();
                bot1.type = 'BUMPER';
                bot1.x = 100; bot1.y = 100;
                bot1.mass = 20; bot1.radius = 20;
                bot1.speedBoost = 1.0;

                const bot2 = Spawner.spawnBot();
                bot2.type = 'BUMPER';
                bot2.x = 120; bot2.y = 100;
                bot2.mass = 20; bot2.radius = 20;
                bot2.speedBoost = 1.0;

                // create a mock particle system for collision testing
                const particleSystemMock = {
                    emitExplosion: () => {},
                    emit: () => {}
                };

                const collisionSystem = new CollisionSystem(particleSystemMock, {}, {});
                collisionSystem.resolveEntityCollision(bot1, bot2, player);

                return {
                    success: abilitySuccess,
                    botDistance: botDistance,
                    startDistance: startDistance,
                    playerSpeedBoost: player.speedBoost,
                    botSlowed: bot.isSlowed,
                    mass: player.mass,
                    bot1Speed: bot1.speedBoost,
                    bot2Speed: bot2.speedBoost,
                    bot1X: bot1.x,
                    bot1Y: bot1.y
                };
            }
        """)

        print(f"Verification Result: {result}")

        assert result.get('success') == True, f"KINETIC ability should trigger successfully. Details: {result}"
        assert result['mass'] == 450, "KINETIC ability should cost 50 mass"
        assert result['playerSpeedBoost'] >= 2.5, "KINETIC should grant speed boost"
        assert result['botDistance'] > result['startDistance'], "KINETIC should push bots away"
        assert result['botSlowed'] == True, "KINETIC should disorient (slow) pushed bots"

        assert result['bot1Speed'] > 1.0, "BUMPER should gain speed boost after collision"
        assert result['bot1X'] < 100, "BUMPER should be pushed away"

        await browser.close()
        print("✅ KINETIC and BUMPER mechanics verified successfully!")

if __name__ == "__main__":
    asyncio.run(verify_kinetic())
