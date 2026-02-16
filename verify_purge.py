from playwright.sync_api import sync_playwright
import time

def verify_purge():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8000")
        page.click("#start-btn")
        time.sleep(1)

        print("Triggering Purge...")
        page.evaluate("window.game.purgeSystem.startPurge()")
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
                return { color: h.color, radius: h.radius, mass: h.mass, playerMass: window.game.player.mass };
            })()
        """)
        print(f"Hunter Stats: {hunter_stats}")
        if hunter_stats:
            assert hunter_stats['color'] == '#FFFFFF', "Hunter should be White"

        # Screenshot during Purge
        print("Taking Purge screenshot...")
        page.screenshot(path="verification_purge.png")

        # End Purge
        print("Ending Purge...")
        page.evaluate("window.game.purgeSystem.endPurge(window.game.bots)")
        time.sleep(0.5)

        # Check Glitch Mode Removed
        is_glitch_end = page.evaluate("document.body.classList.contains('glitch-mode')")
        print(f"Glitch Mode Active: {is_glitch_end}")
        assert is_glitch_end == False, "Body should NOT have glitch-mode class"

        # Check Elite Hunters Removed (Marked for deletion)
        # Game loop needs to run to filter them
        time.sleep(1)
        hunter_count_end = page.evaluate("window.game.bots.filter(b => b.type === 'ELITE_HUNTER').length")
        print(f"Elite Hunters Left: {hunter_count_end}")
        assert hunter_count_end == 0, "Elite Hunters should be removed"

        browser.close()

if __name__ == "__main__":
    verify_purge()
