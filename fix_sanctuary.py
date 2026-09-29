with open("verification/verify_sanctuary.py", "r") as f:
    content = f.read()

content = content.replace('page.evaluate("window.game.purgeSystem.startPurge()")', 'page.evaluate("window.game.purgeSystem.startPurge(window.game); window.game.update();")')
content = content.replace('sanctuaries = page.evaluate("window.game.purgeSystem.sanctuaries")', 'sanctuaries = page.evaluate("window.game.purgeSystem.sanctuaries || []")')
content = content.replace('assert len(sanctuaries) > 0, "Sanctuaries should spawn on purge start"', 'if sanctuaries is None:\n        sanctuaries = []\n    assert len(sanctuaries) > 0, "Sanctuaries should spawn on purge start"')

with open("verification/verify_sanctuary.py", "w") as f:
    f.write(content)
