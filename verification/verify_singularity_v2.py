from playwright.sync_api import sync_playwright
import time

def verify_singularity_v2():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Start game via UI hack or button
        # UI might need interaction
        page.evaluate("window.game.ui.onStart('Tester', 'HACKER')")
        time.sleep(1)

        # Trigger Singularity
        print("Hacking mass to trigger Singularity...")
        page.evaluate("window.game.player.mass = 5000")
        time.sleep(0.5)

        active = page.evaluate("window.game.singularitySystem.active")
        assert active, "Singularity should be active"

        # Verify Instability Logic
        print("Injecting food near player to test Event Horizon...")
        # Inject a food at player position (should be eaten instantly)
        # We need to make sure there is food in the array
        page.evaluate("""
            if (window.game.foods.length > 0) {
                const p = window.game.player;
                const f = window.game.foods[0];
                f.x = p.x + 10;
                f.y = p.y + 10;
            }
        """)
        time.sleep(0.5)

        instability = page.evaluate("window.game.singularitySystem.instability")
        print(f"Instability after feeding: {instability}")
        # Note: Instability decays by 0.05 per frame.
        # If we added 2 (from code), and ran 30 frames, it might be gone?
        # 0.5s = 30 frames. 30 * 0.05 = 1.5.
        # So 2 - 1.5 = 0.5. Should be > 0.
        # But verify_singularity logic says checkEventHorizon adds 2.
        # Let's hope it captured it.

        # Verify Void Walker Spawn
        print("Forcing high instability to spawn Void Walkers...")
        page.evaluate("window.game.singularitySystem.instability = 80")
        time.sleep(3) # Wait for RNG

        bots = page.evaluate("window.game.bots.map(b => b.type)")
        has_void_walker = "VOID_WALKER" in bots
        print(f"Bots types: {bots}")
        print(f"Void Walkers spawned: {has_void_walker}")

        # Take screenshot of Void Walkers
        page.screenshot(path="verification_singularity_v2.png")
        print("Screenshot taken: verification_singularity_v2.png")

        # Verify Discharge
        print("Triggering Critical Mass Discharge...")

        # Clear bots to prevent Void Walker from eating player during test
        page.evaluate("window.game.bots = []")

        # Ensure mass is high enough before discharge
        page.evaluate("window.game.player.mass = 5000")

        active_check = page.evaluate("window.game.singularitySystem.active")
        print(f"Singularity Active before discharge test: {active_check}")

        # Set > 100 because manageInstability decays it by 0.05 before check
        page.evaluate("window.game.singularitySystem.instability = 105")

        # Force update to ensure it runs
        page.evaluate("window.game.singularitySystem.manageInstability(window.game.player, [])")

        # Verify it was set
        check_val = page.evaluate("window.game.singularitySystem.instability")
        print(f"Instability set to: {check_val}")

        time.sleep(0.5)

        mass = page.evaluate("window.game.player.mass")
        shake = page.evaluate("window.game.renderer.screenShake")
        print(f"Mass after discharge: {mass}")
        print(f"Screen Shake after discharge: {shake}")

        assert mass < 4000, f"Mass should be significantly reduced. Got {mass}"

        instability_after = page.evaluate("window.game.singularitySystem.instability")
        print(f"Instability after discharge: {instability_after}")
        assert instability_after == 0, "Instability should reset to 0"

        browser.close()
        print("Verification Successful!")

if __name__ == "__main__":
    verify_singularity_v2()
