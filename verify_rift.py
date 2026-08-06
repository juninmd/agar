import time
import sys
from playwright.sync_api import sync_playwright

def verify_rift_collision():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000?skipBoot=true")

        # Start game by clicking start button
        page.click("#start-btn")

        time.sleep(1)

        result = page.evaluate("""() => {
            const game = window.game;
            if (!game) return { success: false, error: 'Game not found' };

            const player = game.player;
            if (!player) return { success: false, error: 'Player not found' };

            // Get initial player position
            const initialX = player.x;
            const initialY = player.y;

            // Clear existing rifts
            game.riftSystem.rifts = [];

            // Spawn a Rift directly on top of the player
            const rift = {
                x: initialX,
                y: initialY,
                radius: 60,
                color: '#00FFFF',
                type: 'RIFT',
                markedForDeletion: false,
                update: function() { this.rotation += 0.02; },
                rotation: 0
            };

            game.riftSystem.rifts.push(rift);

            // Allow one frame for collision check
            game._checkCollisions();

            // After collision, player's position should be different, and rift markedForDeletion
            const teleported = (player.x !== initialX || player.y !== initialY);
            const riftDeleted = rift.markedForDeletion;

            return {
                success: teleported && riftDeleted,
                initialX: initialX,
                initialY: initialY,
                newX: player.x,
                newY: player.y,
                riftDeleted: riftDeleted
            };
        }""")

        browser.close()

        if result.get("success"):
            print("SUCCESS: Rift collision successfully teleported player and marked rift for deletion.")
            return True
        else:
            print("FAILURE: Rift collision did not work as expected:", result)
            return False

if __name__ == "__main__":
    success = verify_rift_collision()
    if not success:
        sys.exit(1)
