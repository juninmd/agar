from playwright.sync_api import sync_playwright
import time
import subprocess

def run_cuj(page):
    page.goto("http://localhost:8000")
    page.wait_for_timeout(1000)

    # Fill name
    page.evaluate("document.getElementById('player-name').value = 'MagnetarTest'")
    page.wait_for_timeout(500)

    # Select Protocol
    page.evaluate("""
        document.querySelectorAll('.protocol-card').forEach(c => c.classList.remove('selected'));
        const magnetarCard = document.querySelector('.protocol-card[data-id="MAGNETAR"]');
        if(magnetarCard) magnetarCard.classList.add('selected');
        window.selectedProtocolId = 'MAGNETAR';
    """)
    page.wait_for_timeout(500)

    # Click start
    page.evaluate("document.getElementById('start-btn').click()")
    page.wait_for_timeout(1000)

    # Give player some mass
    page.evaluate("window.game.player.mass = 500; window.game.player.radius = 50;")

    # Spawn some bots and foods nearby
    page.evaluate("""
        const p = window.game.player;
        window.game.bots = [
            new window.Bot(p.x + 200, p.y + 200, 20, '#fff', 'NORMAL'),
            new window.Bot(p.x - 200, p.y + 200, 20, '#f00', 'NORMAL'),
            new window.Bot(p.x, p.y - 300, 30, '#0f0', 'LODESTONE')
        ];
        // Let's spawn them properly
        window.game.foods = [];
        for(let i=0; i<10; i++) {
             const f = window.game.foods.push({
                 x: p.x + (Math.random()-0.5)*300,
                 y: p.y + (Math.random()-0.5)*300,
                 radius: 5, color: '#ff0', markedForDeletion: false
             });
        }
    """)

    # Activate MAGNETAR ability
    page.keyboard.press("Shift")
    page.wait_for_timeout(2000)

    # Take screenshot at the key moment showing the ability active
    page.screenshot(path="/home/jules/verification/screenshots/verification_magnetar.png")
    page.wait_for_timeout(1000)  # Hold final state for the video

if __name__ == "__main__":
    server = subprocess.Popen(["python3", "-m", "http.server", "8000"])
    time.sleep(1)

    import os
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()
            server.terminate()
