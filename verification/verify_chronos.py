from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000")
    page.wait_for_timeout(1000)

    # Click on the CHRONOS protocol card
    page.evaluate('if(document.querySelector(".protocol-card--chronos")) { document.querySelector(".protocol-card--chronos").click(); }')
    page.wait_for_timeout(500)

    # Fill in name and start
    page.get_by_placeholder("ID DO PROTOCOLO").fill("CHRONO_TEST")
    page.wait_for_timeout(500)

    page.evaluate('if(document.getElementById("start-btn")) { document.getElementById("start-btn").click(); }')
    page.wait_for_timeout(2000)

    # Move the mouse around a bit to move the player and build history
    page.mouse.move(500, 500)
    page.wait_for_timeout(500)
    page.mouse.move(800, 200)
    page.wait_for_timeout(500)
    page.mouse.move(200, 800)
    page.wait_for_timeout(1000)

    # Press 'E' to trigger Chronos ability
    page.keyboard.press("e")
    page.wait_for_timeout(1000)

    # Take screenshot of the rewind effect / state
    page.screenshot(path="verification/screenshots/verification_chronos.png")
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
