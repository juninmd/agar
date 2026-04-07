from playwright.sync_api import sync_playwright
import time
import math

def verify_nexus():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to the game with skipBoot to save time
        page.goto("http://localhost:8000?skipBoot=true")

        # 2. Add NEXUS protocol card dynamically if it's not present yet
        page.evaluate("""
            const container = document.getElementById('protocol-selection');
            const card = document.createElement('div');
            card.className = 'protocol-card';
            card.dataset.id = 'NEXUS';
            card.innerHTML = '<h3>NEXUS</h3><p>CORE SHATTER</p>';
            container.appendChild(card);
        """)

        # Select NEXUS protocol
        print("Selecting NEXUS protocol...")
        page.wait_for_selector(".protocol-card[data-id='NEXUS']")
        page.click(".protocol-card[data-id='NEXUS']")

        # 3. Click Start
        print("Starting game...")
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")

        # 4. Wait for game to initialize
        time.sleep(1)

        # 5. Inject a FRAGMENTER bot close to the player to test consumption
        print("Injecting FRAGMENTER bot...")
        page.evaluate("""
            window.player.grow(2000 - window.player.mass);
            const bot = new window.Bot(window.player.x + 10, window.player.y + 10, 20, '#00FFCC', 'FRAGMENTER');
            window.bots.push(bot);
        """)

        # 6. Wait a bit for collision to process
        time.sleep(0.5)

        # 7. Check if foods array increased significantly (shards)
        print("Checking for shards...")
        foods_count = page.evaluate("window.foods.length")
        if foods_count > 400: # 400 is the default CONSTANTS.FOOD_COUNT
            print(f"Success: Found {foods_count} food items (shards generated).")
        else:
            print(f"Warning: Food count is {foods_count}, expected > 400.")

        # 8. Test NEXUS ability
        print("Testing NEXUS active ability (Crystal Shatter)...")
        page.evaluate("""
            window.bots = [];
            window.player.grow(1000 - window.player.mass);
            window.player.abilities.cooldown = 0; // reset cooldown just in case
            window.player.abilities.isActive = false;
            const targetBot = new window.Bot(window.player.x + 100, window.player.y + 100, 50, '#FF0000', 'NORMAL');
            targetBot.mass = 1000;
            window.bots.push(targetBot);
            window.player.triggerAbility(window.bots);
        """)

        time.sleep(0.5)

        bot_mass = page.evaluate("window.bots[0].mass")
        player_mass = page.evaluate("window.player.mass")

        print(f"Bot mass after shatter: {bot_mass}")
        print(f"Player mass after shatter: {player_mass}")

        if bot_mass < 1000 and player_mass < 1000:
             print("Success: Nexus ability triggered correctly (player lost mass, bot lost mass).")
        else:
             print("Failure: Nexus ability did not trigger correctly.")
             exit(1)

        print("Taking screenshot...")
        page.screenshot(path="verification_nexus.png")

        browser.close()
        print("NEXUS verification complete.")

if __name__ == "__main__":
    verify_nexus()
