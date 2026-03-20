from playwright.sync_api import sync_playwright

def test_soulbound_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000/?skipBoot=true")

        # Select the SOULBOUND protocol
        page.evaluate('''
            const cards = document.querySelectorAll('.protocol-card');
            cards.forEach(card => card.classList.remove('selected'));
            const soulboundCard = document.querySelector('.protocol-card[data-id="SOULBOUND"]');
            if (soulboundCard) soulboundCard.classList.add('selected');
        ''')

        # Click Start
        page.evaluate("if(document.getElementById('start-btn')) { document.getElementById('start-btn').click(); }")

        # Wait for game to initialize
        page.wait_for_timeout(1000)

        # Trigger ability (Soul Storm)
        page.keyboard.press("Shift")

        # Wait a bit for the animation to expand
        page.wait_for_timeout(500)

        page.screenshot(path="verification/verification_soulbound.png")
        print("Screenshot saved to verification/verification_soulbound.png")

        browser.close()

if __name__ == "__main__":
    test_soulbound_visuals()
