"""Regenerates the README screenshots in docs/images (run `python3 -m http.server 8000` first)."""
from playwright.sync_api import sync_playwright

OUT = "docs/images/"
URL = "http://localhost:8000/?skipBoot"


def play(page, mass=None, wait=2500, protocol=None):
    if protocol:
        page.click(f".protocol-card[data-id={protocol}]")
    page.evaluate("document.getElementById('start-btn').click()")
    page.wait_for_timeout(1500)
    page.evaluate("game.player.invulnerable = true; game.bots.forEach(b => { b.x += 900; })")
    if mass:
        page.evaluate(f"game.player.mass = {mass}")
    page.wait_for_timeout(wait)


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=__import__("os").environ.get("CHROMIUM_PATH"))
    desktop = browser.new_context(viewport={"width": 1280, "height": 800})
    page = desktop.new_page()
    page.goto(URL)
    page.wait_for_timeout(5500)  # let the boot toast fade out
    page.click(".protocol-card[data-id=CYPHER]")
    page.screenshot(path=OUT + "start-screen.png")
    play(page, wait=3000)
    page.screenshot(path=OUT + "gameplay.png")
    page.evaluate("game.player.mass = 2600")
    page.wait_for_timeout(900)
    page.screenshot(path=OUT + "purge-event.png")
    page.evaluate("game.player.mass = 5000")
    page.wait_for_timeout(800)
    page.screenshot(path=OUT + "win-screen.png")
    page.goto(URL)
    page.wait_for_timeout(5500)  # let the boot toast fade out
    page.click("#database-btn")
    page.wait_for_timeout(500)
    page.screenshot(path=OUT + "archives.png")

    mobile = browser.new_context(viewport={"width": 390, "height": 780}, has_touch=True, is_mobile=True)
    m = mobile.new_page()
    m.goto(URL)
    m.wait_for_timeout(5500)
    m.screenshot(path=OUT + "mobile-start.png")
    play(m, wait=2500)
    m.screenshot(path=OUT + "mobile-gameplay.png")
    browser.close()
