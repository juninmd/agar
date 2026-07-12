from playwright.sync_api import sync_playwright
import time

def verify_true_win():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Step 1: Mock local storage to unlock all lore fragments
        # so OMNI protocol is available.
        # We need an array of IDs from 1 to 37.
        lore_ids = list(range(1, 38))
        page.goto("http://localhost:8000")
        page.evaluate(f"localStorage.setItem('neon_phage_lore_v1', JSON.stringify({lore_ids}))")

        # Reload to apply local storage
        page.reload()
        time.sleep(1)

        # Step 2: Select OMNI protocol and start
        # The protocol selection logic uses `.protocol-card[data-id="OMNI"]`
        page.evaluate("document.querySelector('.protocol-card[data-id=\"OMNI\"]').click()")
        page.click("#start-btn")
        time.sleep(1)

        # Verify player protocol is OMNI
        protocol = page.evaluate("window.game.player.protocol.id")
        print(f"Player protocol: {protocol}")
        assert protocol == "OMNI", "Player protocol should be OMNI"

        # Step 3: Trigger the win condition by removing all bots
        print("Clearing all bots to trigger win condition...")
        page.evaluate("window.game.bots = []")
        time.sleep(1)

        # Step 4: Verify true win screen is visible
        is_true_win_hidden = page.evaluate("document.getElementById('true-win-screen').classList.contains('hidden')")
        print(f"True Win Screen hidden: {is_true_win_hidden}")
        assert not is_true_win_hidden, "True Win Screen should be visible!"

        page.screenshot(path="verification_true_win.png")
        print("Screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_true_win()
