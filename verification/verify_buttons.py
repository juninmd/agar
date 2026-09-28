from playwright.sync_api import sync_playwright

def verify_buttons():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Spoof webdriver flag to bypass bot detection on start screen
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false})")

        page.goto("http://localhost:8000/?skipBoot=true")

        # Wait for the database button and click it
        page.wait_for_selector("#database-btn", state="visible")
        page.wait_for_timeout(1000)

        # Check button texts
        start_btn = page.locator("#start-btn")
        print(f"Start button text: {start_btn.text_content()}")

        db_btn = page.locator("#database-btn")
        print(f"Database button text: {db_btn.text_content()}")

        # Take screenshot of the main menu
        page.screenshot(path="verification/menu_buttons.png")
        print("Screenshot captured at verification/menu_buttons.png")

        # Start game and trigger game over to check restart button
        start_btn.click()
        page.wait_for_timeout(1000)

        # We need to manually set the player integrity to 0 to trigger game over
        page.evaluate("window.game.player.integrity = 0")
        page.evaluate("window.game.update()")
        page.wait_for_timeout(1000)

        restart_btn = page.locator("#restart-btn")
        print(f"Restart button text: {restart_btn.text_content()}")

        page.screenshot(path="verification/game_over_buttons.png")
        print("Screenshot captured at verification/game_over_buttons.png")

        # Test true win btn by showing the screen
        page.evaluate("document.getElementById('true-win-screen').classList.remove('hidden')")
        page.wait_for_timeout(1000)

        true_win_btn = page.locator("#true-win-btn")
        print(f"True win button text: {true_win_btn.text_content()}")
        page.screenshot(path="verification/true_win_buttons.png")
        print("Screenshot captured at verification/true_win_buttons.png")

        # View db ui to screenshot english text
        page.goto("http://localhost:8000/?skipBoot=true")
        page.wait_for_selector("#database-btn", state="visible")
        page.evaluate("document.getElementById('database-btn').click()")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/db_ui_english.png")

        browser.close()

if __name__ == "__main__":
    verify_buttons()
