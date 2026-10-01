from playwright.sync_api import sync_playwright
import os
import glob
import time

def run_cuj(page):
    page.goto("http://localhost:8000")
    page.wait_for_timeout(1000)

    # Start the game with some default settings
    page.get_by_role("button", name="INITIATE EXECUTION").click()
    page.wait_for_timeout(2000)

    # Leaderboard should be visible
    page.screenshot(path="/home/jules/verification/screenshots/leaderboard.png")
    page.wait_for_timeout(2000)

    # Press space a few times to dash and change mass
    page.keyboard.press("Space")
    page.wait_for_timeout(500)
    page.keyboard.press("Space")
    page.wait_for_timeout(1000)

    page.screenshot(path="/home/jules/verification/screenshots/leaderboard2.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    os.makedirs("/home/jules/verification/videos", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()

    # Find the video file
    video_files = glob.glob("/home/jules/verification/videos/*.webm")
    if video_files:
        print(f"Video saved to {video_files[0]}")
    else:
        print("No video found")
