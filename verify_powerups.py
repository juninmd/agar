from playwright.sync_api import sync_playwright
import time

def verify_powerup():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8000")
        page.wait_for_selector("#start-btn")
        page.click("#start-btn")
        time.sleep(1)

        # Get initial
        initial = page.evaluate("({mass: window.player.mass, x: window.player.x, y: window.player.y})")
        print(f"Initial: {initial}")

        # Inject PowerUp closer
        page.evaluate("""
            const pu = new window.PowerUp(window.player.x + 60, window.player.y, 20, '#FFD700');
            pu.name = "TEST_PU";
            window.foods.push(pu);
        """)
        print("Injected PowerUp")

        # Move mouse via JS dispatch to be sure
        viewport = page.viewport_size
        target_x = viewport['width'] / 2 + 200
        target_y = viewport['height'] / 2

        page.evaluate(f"""
            window.dispatchEvent(new MouseEvent('mousemove', {{
                clientX: {target_x},
                clientY: {target_y}
            }}));
        """)

        # Step a few times and check
        for i in range(20):
            time.sleep(0.1)
            state = page.evaluate("({mass: window.player.mass, x: window.player.x, pu: window.foods.find(f => f.name === 'TEST_PU')})")
            print(f"Step {i}: PlayerX={state['x']:.1f}, PU={state['pu'] is not None}")

            if state['mass'] > initial['mass'] + 100:
                print(f"SUCCESS: Mass increased to {state['mass']}")
                browser.close()
                return

        page.screenshot(path="debug_powerup_fail.png")
        print("FAILURE: Mass did not increase.")
        exit(1)

if __name__ == "__main__":
    verify_powerup()
