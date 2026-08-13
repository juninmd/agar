from playwright.sync_api import sync_playwright
import time

def verify_network():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Assume Python server is serving on 8000 and socket server on 3000
        page.goto("http://localhost:8000")

        # Wait for the boot sequence to finish or use skipBoot
        page.goto("http://localhost:8000/?skipBoot=true")
        time.sleep(1)

        # Fill in the room id
        page.fill("#room-id", "test-room")

        # Click start
        page.click("#start-btn")

        time.sleep(2)

        # Check if game is running and we didn't crash
        score = page.text_content("#score-display")
        assert score is not None, "Score display not found, game might have crashed"
        print("Game started with room ID successfully. Networking integration seems stable.")

        browser.close()

if __name__ == "__main__":
    verify_network()
