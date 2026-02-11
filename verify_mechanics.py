from playwright.sync_api import sync_playwright
import time

def verify_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:8000")
        except:
            print("ERROR: Server not running on 8000")
            return

        print("Waiting for game start...")
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")
        time.sleep(1)

        # Verify Speed PowerUp
        print("Verifying Speed PowerUp...")
        # Inject Speed PowerUp directly
        page.evaluate("""
            const pu = new window.PowerUp(window.player.x, window.player.y, 'SPEED');
            window.player.applyPowerUp(pu.powerUpType);
        """)

        speed_boost = page.evaluate("window.player.speedBoost")
        print(f"Speed Boost: {speed_boost}")

        if speed_boost >= 2.5:
             print("SUCCESS: Speed PowerUp applied.")
        else:
             print(f"FAILURE: Speed PowerUp failed. Boost: {speed_boost}")
             browser.close()
             exit(1)

        # Verify Shield PowerUp
        print("Verifying Shield PowerUp...")
        page.evaluate("""
            const pu = new window.PowerUp(window.player.x, window.player.y, 'SHIELD');
            window.player.applyPowerUp(pu.powerUpType);
        """)
        invulnerable = page.evaluate("window.player.invulnerable")
        print(f"Invulnerable: {invulnerable}")

        if invulnerable:
             print("SUCCESS: Shield PowerUp applied.")
        else:
             print("FAILURE: Shield PowerUp failed.")
             browser.close()
             exit(1)

        # Verify Player Death (Last test as it ends game)
        print("Verifying Player Death...")
        # Spawn huge bot
        page.evaluate("""
            const bot = new window.Bot(window.player.x, window.player.y, 100, '#FF0000', 'SEEKER');
            bot.mass = window.player.mass * 5.0;
            bot.radius = 200;
            // Remove shield first!
            window.player.shieldEffectTimer = 0;
            window.player.invulnerable = false;
            window.bots.push(bot);
        """)

        # Wait a bit for collision
        start_time = time.time()
        died = False
        while time.time() - start_time < 5:
            if page.is_visible("#game-over-screen"):
                died = True
                break
            time.sleep(0.5)

        if died:
            print("SUCCESS: Player died.")
        else:
            print("FAILURE: Player survived larger bot collision.")
            browser.close()
            exit(1)

        browser.close()

if __name__ == "__main__":
    verify_features()
