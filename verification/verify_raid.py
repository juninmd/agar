from playwright.sync_api import sync_playwright
import time

def verify_raid():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to game...")
        page.goto("http://localhost:8000")
        page.wait_for_selector("#start-btn")

        # Attach console listener
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))

        # Start game
        page.click("#start-btn")
        time.sleep(1)

        print("Forcing Raid Conditions...")
        page.evaluate("window.game.systemIntegrity = 15")
        page.evaluate("window.game.player.mass = 2500")

        # Force update loop to trigger raid check immediately
        time.sleep(2)

        # Check for Titan
        print("Checking for Titan...")
        titan_exists = page.evaluate("""() => {
            return window.game.bots.some(b => b.type === 'TITAN');
        }""")

        if titan_exists:
            print("SUCCESS: Null Void Titan spawned.")
        else:
            print("FAILURE: Titan not found.")
            exit(1)

        # Wait for Minion Spawning (Titan spawns minions every 300 frames / ~5s)
        print("Waiting for Minion Spawn cycle (6s)...")
        time.sleep(6)

        # Check if game crashed (page closed or unresponsive)
        try:
            page.evaluate("window.game.gameRunning")
        except Exception as e:
            print(f"FAILURE: Game crashed during minion spawn cycle! Error: {e}")
            exit(1)

        print("Checking for Minions (Void Walkers)...")
        minions_exist = page.evaluate("""() => {
            return window.game.bots.some(b => b.type === 'VOID_WALKER');
        }""")

        if minions_exist:
             print("SUCCESS: Void Walkers spawned.")
        else:
             print("FAILURE: Void Walkers NOT found.")
             exit(1)

        # Check Health Bar
        print("Checking Titan Health Bar...")
        health_bar_visible = page.evaluate("""() => {
            return document.querySelector('.titan-health-container') !== null;
        }""")

        if health_bar_visible:
            print("SUCCESS: Titan health bar visible.")
        else:
            print("FAILURE: Titan health bar missing.")
            exit(1)

        browser.close()

if __name__ == "__main__":
    verify_raid()
