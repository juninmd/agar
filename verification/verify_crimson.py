import asyncio
from playwright.async_api import async_playwright

async def verify_crimson():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8000")

        await page.wait_for_timeout(1000)

        # Evaluate isolated check for Vampyr ability and Ghoul bot logic
        result = await page.evaluate("""
            async () => {
                const utilsModule = await import('./js/utils.js');
                const spawnerModule = await import('./js/spawner.js');
                const abilityEffectsModule = await import('./js/ability_effects.js');
                const playerModule = await import('./js/player.js');
                const aiPhysicsModule = await import('./js/ai_strategies_physics.js');

                const Utils = utilsModule.Utils;
                const Spawner = spawnerModule.Spawner;
                const AbilityEffects = abilityEffectsModule.AbilityEffects;
                const Player = playerModule.Player;
                const AIStrategiesPhysics = aiPhysicsModule.AIStrategiesPhysics;

                // --- VAMPYR ABILITY TEST ---
                const player = new Player(500, 500, 'VAMPYR', 'Dracula');
                player.mass = 500;
                player.radius = Utils.getRadiusFromMass(player.mass);

                const bot = Spawner.spawnBot();
                bot.x = player.x + 100;
                bot.y = player.y;
                bot.mass = 100;
                bot.radius = Utils.getRadiusFromMass(bot.mass);

                const bots = [bot];
                const tetheredBots = [];

                // Call updateVampyr directly
                AbilityEffects.updateVampyr(player, bots, tetheredBots);

                const drainSuccess = (player.mass > 500) && (bot.mass < 100) && (tetheredBots.length === 1);

                // --- GHOUL AI TEST ---
                const ghoul = Spawner.spawnBot();
                ghoul.type = 'GHOUL';
                ghoul.x = 200; ghoul.y = 200;
                ghoul.mass = 50; ghoul.radius = Utils.getRadiusFromMass(ghoul.mass);

                // Small prey
                const prey = Spawner.spawnBot();
                prey.x = 250; prey.y = 200;
                prey.mass = 20; prey.radius = Utils.getRadiusFromMass(prey.mass);

                let ghoulTargetX = ghoul.x;
                ghoul.setTarget = (x, y) => { ghoulTargetX = x; };

                AIStrategiesPhysics.thinkGhoul(ghoul, [ghoul, prey], [], () => {});

                // Ghoul should move towards prey (x: 250)
                const huntSuccess = ghoulTargetX > 200;

                // Large threat
                const threat = Spawner.spawnBot();
                threat.x = 250; threat.y = 200;
                threat.mass = 150; threat.radius = Utils.getRadiusFromMass(threat.mass);

                ghoulTargetX = ghoul.x; // reset
                AIStrategiesPhysics.thinkGhoul(ghoul, [ghoul, threat], [], () => {});

                // Ghoul should flee from threat (move left, so x < 200)
                const fleeSuccess = ghoulTargetX < 200;

                return {
                    drainSuccess: drainSuccess,
                    huntSuccess: huntSuccess,
                    fleeSuccess: fleeSuccess,
                    playerMass: player.mass,
                    botMass: bot.mass
                };
            }
        """)

        print(f"Verification Result: {result}")

        assert result['drainSuccess'] == True, "VAMPYR ability should drain mass from the bot."
        assert result['huntSuccess'] == True, "GHOUL should hunt smaller entities."
        assert result['fleeSuccess'] == True, "GHOUL should flee from larger entities."

        await browser.close()
        print("✅ VAMPYR and GHOUL mechanics verified successfully!")

if __name__ == "__main__":
    asyncio.run(verify_crimson())
