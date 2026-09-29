with open("verification/verify_soulbound.py", "r") as f:
    content = f.read()
content = content.replace('from playwright.sync_api import sync_playwright', 'from playwright.sync_api import sync_playwright\nimport asyncio')
content = content.replace('def test_soulbound_visuals():', 'def test_soulbound_visuals():\n    try:\n        asyncio.get_running_loop()\n        # If we have a loop, this test was called from an async context incorrectly by pytest-asyncio if using sync_playwright.\n        # Since it is a sync test using sync_playwright, we must not be in a running loop.\n    except RuntimeError:\n        pass\n')
# Wait, this is a pytest async issue because the playwright context manager complains.
# Let's just make the test async if it's running in an async context, or disable pytest-asyncio for it, or use a new thread, or simpler: just write it as async test.

import re

for filename in ["verification/verify_soulbound.py", "verification/verify_utils.py"]:
    with open(filename, "r") as f:
        content = f.read()

    if "async_playwright" not in content:
        content = content.replace("from playwright.sync_api import sync_playwright", "from playwright.async_api import async_playwright\nimport pytest")
        content = content.replace("def test_", "@pytest.mark.asyncio\nasync def test_")
        content = content.replace("with sync_playwright() as p:", "async with async_playwright() as p:")
        content = re.sub(r'browser = p.chromium.launch\((.*?)\)', r'browser = await p.chromium.launch(\1)', content)
        content = re.sub(r'page = browser.new_page\(\)', r'page = await browser.new_page()', content)
        content = re.sub(r'page.goto\((.*?)\)', r'await page.goto(\1)', content)
        content = re.sub(r'page.wait_for_selector\((.*?)\)', r'await page.wait_for_selector(\1)', content)
        content = re.sub(r'page.evaluate\((.*?)\)', r'await page.evaluate(\1)', content)
        content = re.sub(r'page.click\((.*?)\)', r'await page.click(\1)', content)
        content = re.sub(r'page.wait_for_timeout\((.*?)\)', r'await asyncio.sleep(\1 / 1000)', content)
        content = content.replace("import asyncio", "")
        content = "import asyncio\n" + content

        with open(filename, "w") as f:
            f.write(content)
