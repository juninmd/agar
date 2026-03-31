from playwright.sync_api import sync_playwright

def test_chronos_logic():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000/?skipBoot=true")

        # Select the CHRONOS protocol
        page.evaluate('''
            const cards = document.querySelectorAll('.protocol-card');
            cards.forEach(card => card.classList.remove('selected'));
            const chronosCard = document.querySelector('.protocol-card[data-id="CHRONOS"]');
            if (chronosCard) chronosCard.classList.add('selected');
        ''')

        # Click Start
        page.evaluate("if(document.getElementById('start-btn')) { document.getElementById('start-btn').click(); }")

        # Wait for game to initialize
        page.wait_for_timeout(1000)

        # Dispatch mousemove events instead of hacking game variables
        page.mouse.move(800, 800)
        page.wait_for_timeout(3000) # Wait 3 seconds to fill history

        pos1 = page.evaluate("() => { return { x: window.player.x, y: window.player.y }; }")
        print(f"Position 1 (at t=3s): {pos1}")

        # Move mouse to opposite corner
        page.mouse.move(100, 100)
        page.wait_for_timeout(3000) # Wait 3 seconds to move there

        pos2 = page.evaluate("() => { return { x: window.player.x, y: window.player.y }; }")
        print(f"Position 2 (at t=6s): {pos2}")

        # We know history holds 3 seconds (180 frames). So rewinding now should take us back exactly 3 seconds ago, which is pos1.
        page.keyboard.press("e")
        page.wait_for_timeout(100)

        pos3 = page.evaluate("() => { return { x: window.player.x, y: window.player.y }; }")
        print(f"Position 3 (after rewind): {pos3}")

        # Take screenshot of the rewind effect / state
        page.screenshot(path="verification/screenshots/verification_chronos.png")
        print("Screenshot saved to verification/screenshots/verification_chronos.png")

        # Basic assertion that it moved back
        assert abs(pos3['x'] - pos2['x']) > 50 or abs(pos3['y'] - pos2['y']) > 50, "Player didn't rewind position properly"

        # The new position should be very close to pos1
        dist_to_pos1 = ((pos3['x'] - pos1['x'])**2 + (pos3['y'] - pos1['y'])**2)**0.5
        dist_to_pos2 = ((pos3['x'] - pos2['x'])**2 + (pos3['y'] - pos2['y'])**2)**0.5
        assert dist_to_pos1 < dist_to_pos2, "Rewind didn't go back far enough"
        print("Rewind successful!")

        browser.close()

if __name__ == "__main__":
    test_chronos_logic()