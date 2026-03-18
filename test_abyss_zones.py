import unittest
from abyss_zones import AbyssZone, ObscuredEntity, AbyssManager

class DummyEntity:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class TestAbyssZones(unittest.TestCase):
    def test_obscured_entity(self):
        ent = DummyEntity(10, 10)
        obs = ObscuredEntity(ent, False)

        self.assertFalse(obs.is_obscured)
        self.assertEqual(obs.flicker_effect, 0.0)

        obs.update_flicker(1.0)
        self.assertEqual(obs.flicker_effect, 1.0)

        obs.is_obscured = True
        obs.update_flicker(1.0)
        self.assertGreaterEqual(obs.flicker_effect, 0.1)
        self.assertLessEqual(obs.flicker_effect, 0.4)

    def test_abyss_zone_creation_and_contains(self):
        zone = AbyssZone("z1", 100, 100, 50, 60000)
        self.assertTrue(zone.active)
        self.assertTrue(zone.contains(110, 110))
        self.assertFalse(zone.contains(200, 200))

    def test_abyss_zone_visibility_rules(self):
        zone = AbyssZone("z1", 100, 100, 50, 60000)

        ent_inside = ObscuredEntity(DummyEntity(110, 110))
        ent_outside = ObscuredEntity(DummyEntity(200, 200))

        zone.apply_visibility_rules([ent_inside, ent_outside])

        self.assertTrue(ent_inside.is_obscured)
        self.assertFalse(ent_outside.is_obscured)

    def test_abyss_zone_update_and_alpha(self):
        zone = AbyssZone("z1", 100, 100, 50, 60000)

        # When max_lifespan - lifespan = 0 (just spawned), alpha should be 0.0 based on fade in logic
        alpha = zone.get_alpha()
        self.assertEqual(alpha, 0.0)

        # Update it a bit to trigger fade-in
        zone.update(1000)
        alpha2 = zone.get_alpha()
        self.assertGreater(alpha2, 0.0)

        zone.update(3000)
        self.assertTrue(zone.active)

        zone.update(60000)
        self.assertFalse(zone.active)

        self.assertEqual(zone.get_alpha(), 0.0)

        # inactive zone visibility logic
        ent = ObscuredEntity(DummyEntity(110, 110))
        zone.apply_visibility_rules([ent])
        self.assertFalse(ent.is_obscured)

    def test_abyss_manager(self):
        manager = AbyssManager(1000, 1000)

        self.assertEqual(len(manager.zones), 0)

        # Test spawn
        manager.generate_zone()
        self.assertEqual(len(manager.zones), 1)

        # Test update (handles spawn and rules)
        ent = ObscuredEntity(DummyEntity(manager.zones[0].x, manager.zones[0].y))

        manager.update([ent], dt=30000.0)

        self.assertTrue(ent.is_obscured)
        self.assertEqual(len(manager.zones), 2)  # Spawns a new one

        # Fast forward time drastically
        # Initial dt = 30000 (Timer = 0, spawned new zone).
        # We need to make sure timer hits 30000 to spawn another,
        # but also make the old zone expire. Let's expire the first one explicitly.
        manager.zones[0].lifespan = 0
        manager.update([ent], dt=30000.0) # Triggers a spawn
        self.assertTrue(len(manager.zones) >= 1)  # The old one expires, new one spawns
        self.assertTrue(ent.flicker_effect >= 0.0)


if __name__ == '__main__':
    unittest.main()
