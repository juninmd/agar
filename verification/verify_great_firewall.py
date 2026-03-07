from playwright.sync_api import sync_playwright

def verify_great_firewall():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        print("Navigating to http://localhost:8000...")
        page.goto("http://localhost:8000?skipBoot=true")

        page.wait_for_selector("#start-btn")
        page.evaluate('if(document.getElementById("start-btn")) { document.getElementById("start-btn").click(); }')

        page.wait_for_timeout(500)

        print("Testing Great Firewall spawn logic...")
        spawn_result = page.evaluate('''() => {
            if (!window.game || !window.game.player) return "No Game";
            window.game.player.mass = 4500;
            window.game.bossSystem.spawnGreatFirewall();
            if (!window.game.bossSystem.activeGreatFirewall) return "Spawn failed";
            return "Spawned";
        }''')

        assert spawn_result == "Spawned", "Great Firewall should spawn"
        print("✅ Great Firewall Spawned.")

        print("Testing player damage collision (mass < node.mass)...")
        damage_result = page.evaluate('''() => {
            window.game.player.mass = 1000; // Less than node mass (1500)
            window.game.player.x = 500;
            window.game.player.y = window.game.bossSystem.activeGreatFirewall.nodes[0].y;
            window.game.bossSystem.activeGreatFirewall.x = 500; // Force collision

            const startMass = window.game.player.mass;
            window.game.bossSystem.activeGreatFirewall.update(window.game);
            return { startMass, currentMass: window.game.player.mass, glitching: window.game.player.isGlitching };
        }''')

        assert damage_result['currentMass'] < damage_result['startMass'], "Player should lose mass"
        assert damage_result['glitching'] == True, "Player should be glitching"
        print("✅ Great Firewall damages player.")

        print("Testing node consumption (mass > node.mass)...")
        consume_result = page.evaluate('''() => {
            window.game.player.mass = 2000; // Greater than node mass (1500)
            const node = window.game.bossSystem.activeGreatFirewall.nodes[1];
            window.game.player.x = 500;
            window.game.player.y = node.y;
            window.game.bossSystem.activeGreatFirewall.x = 500; // Force collision

            const startMass = window.game.player.mass;
            window.game.bossSystem.activeGreatFirewall.update(window.game);
            return { startMass, currentMass: window.game.player.mass, nodeActive: node.active };
        }''')

        assert consume_result['currentMass'] > consume_result['startMass'], "Player should gain mass"
        assert consume_result['nodeActive'] == False, "Node should be deactivated"
        print("✅ Great Firewall node consumed.")

        print("✅ ALL CHECKS PASSED")
        browser.close()

if __name__ == "__main__":
    verify_great_firewall()