from playwright.sync_api import sync_playwright

def verify_weaver():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Access the game
        page.goto("http://localhost:8000")

        # Ensure we skip boot
        page.evaluate('window.location.href = "?skipBoot=true"')
        page.wait_for_selector('#start-btn', state='visible')

        # Click start
        page.evaluate('if(document.getElementById("start-btn")) { document.getElementById("start-btn").click(); }')
        page.wait_for_timeout(500)

        # Give the player lots of mass to meet the >1500 requirement
        page.evaluate('window.game.player.mass = 2000;')
        page.evaluate('window.game.player.radius = 100;')

        # Force the Weaver to spawn
        page.evaluate('window.game.weaverSystem.spawnWeaver(window.game);')
        page.wait_for_timeout(500)

        # Teleport the weaver to the player's view so we can see it
        page.evaluate('''
            if (window.game.weaverSystem.activeWeaver) {
                window.game.weaverSystem.activeWeaver.x = window.game.player.x + 200;
                window.game.weaverSystem.activeWeaver.y = window.game.player.y;
            }
        ''')
        page.wait_for_timeout(500)

        # Take a screenshot
        page.screenshot(path="verification_weaver.png")

        # Check if Weaver was assimilated (Kill Weaver)
        page.evaluate('''
            if (window.game.weaverSystem.activeWeaver) {
                window.game.weaverSystem.activeWeaver.markedForDeletion = true;
            }
        ''')
        page.wait_for_timeout(500)

        # Check lore size
        unlocked_count = page.evaluate('window.game.loreSystem.unlocked.size;')
        print(f"Lore unlocked: {unlocked_count}")

        browser.close()

if __name__ == "__main__":
    verify_weaver()
