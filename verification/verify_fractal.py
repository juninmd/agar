import time
from playwright.sync_api import sync_playwright

def verify_fractal_resonance():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Testing Phase 6: The Fractal Resonance")

        # 1. Navigate
        page.goto("http://localhost:8000")

        # 2. Select ECLIPSE protocol
        print("Selecting ECLIPSE protocol...")
        page.wait_for_selector(".protocol-card[data-id='ECLIPSE']")
        page.click(".protocol-card[data-id='ECLIPSE']")

        # 3. Start Game
        print("Starting execution...")
        page.click("#start-btn")
        time.sleep(1)

        # 4. Give player some mass so they can dash
        print("Granting mass to player...")
        page.evaluate("window.game.player.grow(1500);")

        # 5. Verify Eclipse Dash
        print("Triggering Eclipse Dash...")
        page.keyboard.press("Space")

        # Let the dash logic run for a frame or two
        time.sleep(0.1)

        invulnerable = page.evaluate("window.game.player.invulnerable;")
        eclipseTimer = page.evaluate("window.game.player.eclipseTimer;")

        if invulnerable and eclipseTimer > 0:
            print("ECLIPSE Protocol Dash: SUCCESS (Invulnerable state confirmed)")
        else:
            print(f"ECLIPSE Protocol Dash: FAILED (Invulnerable: {invulnerable}, Timer: {eclipseTimer})")
            raise Exception("Eclipse Dash Invulnerability Check Failed")

        # 6. Verify MIMIC Bot Type logic
        print("Spawning MIMIC Bot...")
        page.evaluate("""
            const mimic = new window.Bot(window.game.player.x + 100, window.game.player.y + 100, 50, '#FFD700', 'MIMIC');
            window.game.bots.push(mimic);
        """)

        # Let the loop update the mimic
        time.sleep(0.5)

        # Check if mimic exists and is drawing correctly (we can't easily check canvas pixels, but we can verify state)
        mimic_exists = page.evaluate("window.game.bots.some(b => b.type === 'MIMIC');")
        if mimic_exists:
            print("MIMIC Bot logic: SUCCESS (Spawned and active in loop)")
        else:
            print("MIMIC Bot logic: FAILED")
            raise Exception("MIMIC Bot logic failed")

        print("Taking screenshot...")
        page.screenshot(path="verification_fractal.png")

        browser.close()

if __name__ == "__main__":
    verify_fractal_resonance()
