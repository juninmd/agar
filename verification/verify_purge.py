from playwright.sync_api import sync_playwright
import time

def verify_purge():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Log console messages
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))
        page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))

        # Start the game
        print("Navigating to game...")
        page.goto("http://localhost:8000")

        # Wait for game to be ready
        page.wait_for_function("() => window.game && window.game.gameRunning === false")

        # Click Start
        print("Starting game...")
        page.click("#start-btn")

        # Wait for game loop to start
        page.wait_for_function("() => window.game.gameRunning === true")
        time.sleep(1)

        print("Setting Player Mass to 3000...")
        page.evaluate("window.game.player.mass = 3000")

        print("Triggering Purge...")
        # Pass window.game as argument
        page.evaluate("window.game.purgeSystem.startPurge(window.game)")
        time.sleep(1)

        # Check Glitch Mode
        is_glitch = page.evaluate("document.body.classList.contains('glitch-mode')")
        print(f"Glitch Mode Active: {is_glitch}")
        assert is_glitch == True, "Body should have glitch-mode class"

        # Check Elite Hunters (Game loop should spawn them in next frame)
        time.sleep(1) # Give it a few frames
        hunter_count = page.evaluate("window.game.bots.filter(b => b.type === 'ELITE_HUNTER').length")
        print(f"Elite Hunters: {hunter_count}")
        assert hunter_count >= 1, "Should have spawned at least 1 Elite Hunter"

        # Check Hunter Properties
        hunter_stats = page.evaluate("""
            (() => {
                const h = window.game.bots.find(b => b.type === 'ELITE_HUNTER');
                if (!h) return null;
                return { color: h.color, radius: h.radius, mass: h.mass };
            })()
        """)
        print(f"Hunter Stats: {hunter_stats}")
        if hunter_stats:
            assert hunter_stats['color'] == '#FFFFFF', "Hunter should be White"

        # End Purge
        print("Ending Purge...")
        page.evaluate("window.game.purgeSystem.endPurge(window.game)")
        time.sleep(0.5)

        # Check Glitch Mode Removed
        is_glitch_end = page.evaluate("document.body.classList.contains('glitch-mode')")
        print(f"Glitch Mode Active: {is_glitch_end}")
        assert is_glitch_end == False, "Body should NOT have glitch-mode class"

        browser.close()

if __name__ == "__main__":
    verify_purge()
