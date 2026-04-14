import asyncio
from playwright.async_api import async_playwright
import unittest

class TestSynapseProtocol(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        self.page = await self.browser.new_page()

    async def test_neuron_clustering(self):
        await self.page.goto("http://localhost:8000")

        await self.page.click('#start-btn')
        await asyncio.sleep(0.5)

        dist = await self.page.evaluate("""
            (() => {
                // Get the Bot class
                let BotClass = window.game.bots[0].constructor;

                let b1 = new BotClass(1000, 1000, 20, '#FF007F', 'NEURON');
                let b2 = new BotClass(1500, 1000, 20, '#FF007F', 'NEURON');

                let entities = [b1, b2];

                // Manually run update loop for 60 frames
                for(let i=0; i<60; i++) {
                    b1.update(2000, 2000, entities, []);
                    b2.update(2000, 2000, entities, []);
                }

                return Math.hypot(b2.x - b1.x, b2.y - b1.y);
            })()
        """)

        self.assertLess(dist, 499, "NEURON bots did not cluster towards each other")

    async def test_synapse_ability(self):
        await self.page.goto("http://localhost:8000")

        # Select SYNAPSE protocol and start
        await self.page.evaluate("document.querySelector('[data-id=\"SYNAPSE\"]').click()")
        await self.page.click('#start-btn')
        await asyncio.sleep(0.5)

        # Setup test scenario
        await self.page.evaluate("""
            window.game.player.mass = 500;
            window.game.player.x = 2000;
            window.game.player.y = 2000;

            // Wait for a bot and place it near player
            if(window.game.bots.length > 0) {
                let bot = window.game.bots[0];
                bot.x = 2100;
                bot.y = 2000;
                bot.confusedTimer = 0;
            }
        """)

        timer_before = await self.page.evaluate("window.game.bots[0].confusedTimer")
        self.assertEqual(timer_before, 0)

        mass_before = await self.page.evaluate("window.game.player.mass")

        # Trigger ability
        await self.page.evaluate("window.game.handleAbility()")

        timer_after = await self.page.evaluate("window.game.bots[0].confusedTimer")
        self.assertGreater(timer_after, 0, "Bot was not confused by SYNAPSE ability")

        mass_after = await self.page.evaluate("window.game.player.mass")
        self.assertLess(mass_after, mass_before, "Player mass was not consumed by SYNAPSE ability")

    async def asyncTearDown(self):
        await self.browser.close()
        await self.playwright.stop()

if __name__ == '__main__':
    unittest.main()
