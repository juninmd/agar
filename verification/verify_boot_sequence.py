from playwright.sync_api import sync_playwright

def test_boot_sequence():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0")
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false})")

        page.goto("http://localhost:8000")

        # Check if boot-screen exists and has correct classes
        boot_screen = page.locator("#boot-screen")
        boot_screen.wait_for(state="attached", timeout=2000)

        class_name = boot_screen.get_attribute("class")
        assert "crt-overlay" in class_name, f"Expected crt-overlay, got {class_name}"
        assert "scanlines" in class_name, f"Expected scanlines, got {class_name}"

        # Wait for boot to finish
        boot_screen.wait_for(state="detached", timeout=10000)

        print("PASS: Boot sequence has CRT scanlines and completes successfully.")
        browser.close()

if __name__ == "__main__":
    test_boot_sequence()
