from playwright.sync_api import sync_playwright
import time
import math

def verify_chronos():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("[TEST] Navigating to game...")
        page.goto("http://localhost:8000/?skipBoot=true")
        page.wait_for_selector("#protocol-selection", state="visible")

        print("[TEST] Selecting CHRONOS protocol...")
        page.click(".protocol-card[data-id='CHRONOS']")

        page.click("#start-btn")
        time.sleep(1) # Let game initialize

        print("[TEST] Verifying initial state...")
        initial_state = page.evaluate("""() => {
            return {
                x: window.player.x,
                y: window.player.y,
                mass: window.player.mass,
                historyLength: window.player.history.length
            };
        }""")

        print(f"Initial State: {initial_state}")

        # Move the player and let history build up
        print("[TEST] Moving player and building history...")
        # Since player follows mouse, we need to move mouse away from center
        page.mouse.move(10, 10)
        time.sleep(2.5) # Wait 2.5 seconds (about 150 frames)

        current_state = page.evaluate("""() => {
            return {
                x: window.player.x,
                y: window.player.y,
                mass: window.player.mass,
                historyLength: window.player.history.length
            };
        }""")

        print(f"Current State after 2s: {current_state}")
        assert current_state["historyLength"] > 0, "History was not recorded"

        # Trigger Chronos ability
        print("[TEST] Triggering Chronos time rewind...")
        # Since ability might require specific UI or key press, we use the global trigger
        page.evaluate("() => { window.player.triggerAbility(window.bots); }")

        time.sleep(0.1) # Wait for state change

        post_rewind_state = page.evaluate("""() => {
            return {
                x: window.player.x,
                y: window.player.y,
                mass: window.player.mass,
                historyLength: window.player.history.length,
                invulnerable: window.player.invulnerable
            };
        }""")

        print(f"Post-Rewind State: {post_rewind_state}")

        # Check if history was cleared
        assert post_rewind_state["historyLength"] == 0, "History was not cleared after rewind"

        # Check if we moved back closer to our initial state
        # Distance should be much closer to initial state than the current state was
        def dist(x1, y1, x2, y2):
            return math.sqrt((x2-x1)**2 + (y2-y1)**2)

        dist_from_initial_before = dist(initial_state["x"], initial_state["y"], current_state["x"], current_state["y"])
        dist_from_initial_after = dist(initial_state["x"], initial_state["y"], post_rewind_state["x"], post_rewind_state["y"])

        print(f"Distance from initial before rewind: {dist_from_initial_before}")
        print(f"Distance from initial after rewind: {dist_from_initial_after}")

        assert dist_from_initial_after < dist_from_initial_before, "Player did not rewind closer to past state"
        assert post_rewind_state["invulnerable"] == True, "Player was not granted invulnerability after rewind"

        print("✅ [PASS] Chronos Time Rewind verified successfully.")

        # Snapshot
        page.screenshot(path="verification_chronos.png")

        browser.close()

if __name__ == "__main__":
    verify_chronos()
