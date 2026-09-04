from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000?skipBoot=true")
    page.wait_for_timeout(500)

    # Force game over screen to appear on top
    page.evaluate("""
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('start-screen').style.display = 'none';

        let go = document.getElementById('game-over-screen');
        go.classList.remove('hidden');
        go.style.display = 'flex';
        go.style.zIndex = '99999';
        go.style.position = 'fixed';
        go.style.width = '100vw';
        go.style.height = '100vh';
        go.style.top = '0';
        go.style.left = '0';
    """)
    page.wait_for_timeout(1000)

    page.screenshot(path="verification/screenshots/verification_game_over3.png")
    page.wait_for_timeout(1000)

    page.evaluate("""
        document.getElementById('game-over-screen').style.display = 'none';

        let win = document.getElementById('win-screen');
        win.classList.remove('hidden');
        win.style.display = 'flex';
        win.style.zIndex = '99999';
        win.style.position = 'fixed';
        win.style.width = '100vw';
        win.style.height = '100vh';
        win.style.top = '0';
        win.style.left = '0';
    """)
    page.wait_for_timeout(1000)

    page.screenshot(path="verification/screenshots/verification_win3.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
