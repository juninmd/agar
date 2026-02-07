from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Start game
        page.click("#start-btn")
        page.wait_for_timeout(1000)

        # Force Purge via global function
        print("Triggering purge...")
        page.evaluate("window.triggerPurge()")

        # Wait for effects
        page.wait_for_timeout(500)

        # Check classes on body
        body_class = page.evaluate("document.body.className")
        print(f"Body classes: {body_class}")
        if "glitch-mode" in body_class:
            print("SUCCESS: glitch-mode class found")
        else:
            print("FAILURE: glitch-mode class NOT found")

        # Check alert
        try:
            alert_text = page.inner_text(".purge-alert")
            print(f"Alert text: {alert_text}")
            if "SYSTEM PURGE INITIATED" in alert_text:
                print("SUCCESS: Alert text correct")
            else:
                print("FAILURE: Alert text incorrect")
        except Exception as e:
            print(f"FAILURE: Could not find alert element. Error: {e}")

        # Screenshot
        page.screenshot(path="verification/purge_event.png")
        print("Screenshot saved to verification/purge_event.png")
        browser.close()

if __name__ == "__main__":
    run()
