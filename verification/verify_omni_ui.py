from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_omni_ui(page: Page):
    print("Navigating to local server...")
    page.goto("http://localhost:8000")

    print("Skipping boot sequence...")
    try:
        page.evaluate("if(document.getElementById('skip-boot-btn')) document.getElementById('skip-boot-btn').click()")
    except Exception as e:
        print(f"Error skipping boot: {e}")
    time.sleep(1)

    print("Taking screenshot BEFORE unlocking OMNI...")
    page.screenshot(path="verification_omni_locked.png")

    print("Injecting lore to unlock OMNI...")
    page.evaluate('''() => {
        for (let i = 1; i <= 34; i++) {
            window.loreSystem.unlock(i);
        }
        const omniCard = document.getElementById('omni-protocol-card');
        if (omniCard) omniCard.classList.remove('hidden');
    }''')
    time.sleep(1)

    print("Taking screenshot AFTER unlocking OMNI...")
    page.screenshot(path="verification_omni_unlocked.png")

    print("Selecting OMNI and starting game...")
    page.evaluate('''() => {
        document.querySelectorAll('.protocol-card').forEach(c => c.classList.remove('selected'));
        const omniCard = document.getElementById('omni-protocol-card');
        if (omniCard) omniCard.classList.add('selected');
        document.getElementById('start-btn').click();
    }''')
    time.sleep(1)

    print("Forcing win condition...")
    page.evaluate("window.game.bots = [];")
    time.sleep(1)

    print("Taking screenshot of True Win Screen...")
    page.screenshot(path="verification_true_win.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_omni_ui(page)
        finally:
            browser.close()