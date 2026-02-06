from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Wait for button to be visible
        db_btn = page.locator("#database-btn")
        expect(db_btn).to_be_visible()

        # Click it
        db_btn.click()

        # Wait for modal
        modal = page.locator("#database-modal")
        expect(modal).to_be_visible()
        expect(page.locator("h2", has_text="ARQUIVOS DO SISTEMA")).to_be_visible()
        expect(page.locator("li", has_text="CORRUPTER")).to_be_visible()

        # Screenshot modal
        if not os.path.exists("verification"):
            os.makedirs("verification")
        page.screenshot(path="verification/db_modal.png")
        print("Modal screenshot saved.")

        # Close modal
        page.locator("#close-db-btn").click()
        expect(modal).not_to_be_visible()

        print("Modal closed successfully.")
        browser.close()

if __name__ == "__main__":
    run()
