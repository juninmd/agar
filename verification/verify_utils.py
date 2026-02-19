from playwright.sync_api import sync_playwright
import os

def test_utils():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # We need to load the module. Since it's an ES module, we need a page that imports it.
        # We can construct a simple HTML string.

        # Read the utils.js content
        with open('js/utils.js', 'r') as f:
            utils_content = f.read()

        # We'll strip the export to make it just a global object for testing in this simple harness
        # OR we can serve it. Since we are supposed to have a server running, let's assume one is running or just serve locally?
        # Simpler: just inject the logic.

        # But `utils.js` has `export const Utils`.
        # We can just evaluate the content but change `export const` to `const`.

        script_content = utils_content.replace('export const Utils', 'const Utils')

        page.set_content(f"""
        <html>
        <body>
        <script>
        {script_content}

        // Test helper
        window.results = [];
        function assert(condition, message) {{
            window.results.push({{pass: !!condition, message: message}});
        }}

        // Test isInViewport
        // x, y, radius, camX, camY, canvasWidth, canvasHeight
        // ScreenX = x + camX
        // ScreenY = y + camY
        // Visible if ScreenX + R >= 0 ...

        // Case 1: Center of screen
        // camX = 0, camY = 0, W=800, H=600. Entity at 400, 300, R=10.
        assert(Utils.isInViewport(400, 300, 10, 0, 0, 800, 600) === true, "Center should be visible");

        // Case 2: Way off screen (Left)
        // Entity at -100, 300. R=10. ScreenX = -100. -100 + 10 = -90 < 0. Hidden.
        assert(Utils.isInViewport(-100, 300, 10, 0, 0, 800, 600) === false, "Way left should be hidden");

        // Case 3: Just touching left edge
        // Entity at -10, 300. R=10. ScreenX = -10. -10 + 10 = 0. Visible.
        assert(Utils.isInViewport(-10, 300, 10, 0, 0, 800, 600) === true, "Touching left edge should be visible");

        // Case 4: Just off right edge
        // Entity at 811, 300. R=10. ScreenX = 811. 811 - 10 = 801 > 800. Hidden.
        assert(Utils.isInViewport(811, 300, 10, 0, 0, 800, 600) === false, "Just off right edge should be hidden");

        // Case 5: Camera Offset
        // CamX = -100. (World 100 maps to 0).
        // Entity at 90, 300. R=10. ScreenX = 90 - 100 = -10. -10 + 10 = 0. Visible.
        assert(Utils.isInViewport(90, 300, 10, -100, 0, 800, 600) === true, "Camera offset visibility check");

        </script>
        </body>
        </html>
        """)

        results = page.evaluate("window.results")

        all_pass = True
        for res in results:
            print(f"{'PASS' if res['pass'] else 'FAIL'}: {res['message']}")
            if not res['pass']:
                all_pass = False

        browser.close()

        if not all_pass:
            exit(1)

if __name__ == "__main__":
    test_utils()
    print("Utils tests completed.")
