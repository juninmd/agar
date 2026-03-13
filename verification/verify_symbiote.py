from playwright.sync_api import sync_playwright
import time

def verify_symbiote():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Select SYMBIOTE protocol
        page.evaluate('''
            document.querySelectorAll(".protocol-card").forEach(c => c.classList.remove("selected"));
            const symbioteCard = document.querySelector('.protocol-card[data-id="SYMBIOTE"]');
            if(symbioteCard) symbioteCard.classList.add("selected");
            window.selectedProtocol = "SYMBIOTE"; // simulate selection logic if needed
        ''')

        page.wait_for_selector("#start-btn")
        page.click("#start-btn")
        time.sleep(1)

        # Check for SYMBIOTE protocol initialized properly
        protocol_id = page.evaluate("window.game.player.protocol.id")
        assert protocol_id == "SYMBIOTE", f"Expected protocol SYMBIOTE, got {protocol_id}"

        # Check decay logic
        initial_mass = page.evaluate("window.game.player.mass")

        # Manually trigger mass decay condition (mass > 50)
        page.evaluate("window.game.player.mass = 100")
        time.sleep(1)
        decayed_mass = page.evaluate("window.game.player.mass")
        assert decayed_mass < 100, f"Expected mass to decay from 100, got {decayed_mass}"

        # Test Parasite Spawn and Drain
        page.evaluate("window.game.player.mass = 150") # Set mass > 100 to trigger drain
        initial_parasite_mass = page.evaluate('''
            const Parasite = window.Bot;
            const radius = 10;
            const parasite = new Parasite(window.game.player.x, window.game.player.y, radius, "#00FF88", "PARASITE");
            window.game.bots.push(parasite);
            return parasite.mass;
        ''')

        # Wait for the parasite to drain mass, which will increase its own mass.
        try:
            page.wait_for_function(f"window.game.bots.find(b => b.type === 'PARASITE').mass > {initial_parasite_mass}", timeout=2000)
        except Exception:
            assert False, "Parasite drain did not occur within timeout."

        print("SUCCESS: Parasite drain verified.")

        page.screenshot(path="verification_symbiote.png")
        print("SUCCESS: SYMBIOTE and PARASITE verified.")
        browser.close()

if __name__ == "__main__":
    verify_symbiote()
