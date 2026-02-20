from playwright.sync_api import sync_playwright
import time

def verify_boot(page):
    # Pass skipBoot=false explicitly just in case, though the check is logical OR
    # Actually, BootSequence checks navigator.webdriver.
    # We can override navigator.webdriver in the context.

    page.goto("http://localhost:8000")

    # 1. Check Boot Screen
    # It should appear.
    try:
        boot_screen = page.locator("#boot-screen")
        boot_screen.wait_for(state="visible", timeout=5000)
        print("Boot screen visible")

        # Wait a bit for some text to appear
        time.sleep(2)
        page.screenshot(path="verification/boot_sequence.png")
        print("Screenshot taken: verification/boot_sequence.png")

        # 2. Wait for completion (or skip)
        page.keyboard.press("Enter")

        # 3. Check Start Screen
        start_screen = page.locator("#start-screen")
        start_screen.wait_for(state="visible", timeout=2000)
        print("Start screen visible")

        page.screenshot(path="verification/post_boot.png")
        print("Screenshot taken: verification/post_boot.png")

    except Exception as e:
        print(f"Verification Failed: {e}")
        page.screenshot(path="verification/error.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        # Launch browser. We need to trick navigator.webdriver if we want to see the boot sequence
        # because our code skips it if webdriver is true.
        # But wait, if I want to verify the SKIP logic, I should see it skip.
        # If I want to verify the VISUALS, I need to see it.
        # Let's try to see the visuals first.
        browser = p.chromium.launch()
        # Create context with webdriver=false to bypass the check
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            java_script_enabled=True,
            ignore_https_errors=True
        )

        # We need to inject script to delete navigator.webdriver or use args
        # But actually, the check is `navigator.webdriver || ...`
        # Playwright sets navigator.webdriver to true.
        # To bypass, we can use an argument in the URL ?forceBoot=true if I implemented it,
        # but I didn't.
        # So I will just add `skipBoot` check.
        # Wait, if I run this script, navigator.webdriver IS true.
        # So boot sequence WILL skip.
        # So I will see the start screen immediately.

        # To verify the boot sequence, I need to modify the code or the test.
        # I'll update the test to expect IMMEDIATE start screen first, to verify the skip logic works.
        page = context.new_page()

        print("--- TEST 1: Default Headless (Should Skip) ---")
        try:
            page.goto("http://localhost:8000")
            page.locator("#start-screen").wait_for(state="visible", timeout=1000)
            print("PASS: Start screen appeared immediately (Skip logic working)")
        except:
             print("FAIL: Start screen did not appear immediately")

        page.close()

        # Now Test 2: Force visuals?
        # I can't force it easily without changing code.
        # But I can use `page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false})")`

        print("--- TEST 2: Visuals (Bypass Webdriver check) ---")
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false})")

        try:
            verify_boot(page)
        finally:
            page.close()
            browser.close()
