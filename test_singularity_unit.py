from playwright.sync_api import sync_playwright
import sys

def test_singularity_unit():
    print("Running Singularity System Unit Tests...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:8000")
        except:
            print("Error: Game server not running at localhost:8000")
            sys.exit(1)

        # Inject and run test logic
        result = page.evaluate("""async () => {
            try {
                const module = await import('./js/singularity_system.js');
                const { SingularitySystem } = module;

                const mockUI = { showCorruptionAlert: () => {} };
                const mockRenderer = { screenShake: 0 };
                const system = new SingularitySystem(mockUI, mockRenderer);

                // Test 1: Initial state
                if (system.active) return 'FAIL: Should be inactive initially';

                // Test 2: Activation
                const player = { mass: 4500, radius: 50, x: 0, y: 0 }; // Threshold is 4000
                system.update(player, []);
                if (!system.active) return 'FAIL: Should activate when mass > threshold';
                if (mockRenderer.screenShake !== 50) return 'FAIL: Screen shake not set';

                // Test 3: Gravity
                const entity = { x: 100, y: 0, mass: 10 };
                const initialX = entity.x;
                system.applyGravity(player, [entity]);
                if (entity.x >= initialX) return 'FAIL: Entity should be pulled towards player';

                return 'PASS';
            } catch (e) {
                return 'ERROR: ' + e.message;
            }
        }""")

        print(f"Test Result: {result}")
        if result != 'PASS':
            sys.exit(1)

if __name__ == "__main__":
    test_singularity_unit()
