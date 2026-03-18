import unittest
from stalker import Entity, Stalker

class TestStalker(unittest.TestCase):
    def test_entity_creation(self):
        ent = Entity("e1", 10.0, 20.0, 5.0)
        self.assertEqual(ent.entity_id, "e1")
        self.assertEqual(ent.x, 10.0)
        self.assertEqual(ent.y, 20.0)
        self.assertEqual(ent.radius, 5.0)
        self.assertEqual(ent.mass, 25.0)

    def test_entity_collision(self):
        ent1 = Entity("e1", 0.0, 0.0, 10.0)
        ent2 = Entity("e2", 15.0, 0.0, 10.0)
        ent3 = Entity("e3", 30.0, 0.0, 10.0)

        self.assertTrue(ent1.check_collision(ent2))
        self.assertFalse(ent1.check_collision(ent3))

    def test_stalker_creation(self):
        stalker = Stalker("s1", 0.0, 0.0)
        self.assertEqual(stalker.base_speed, 1.6)
        self.assertEqual(stalker.visibility, 0.1)

    def test_stalker_calculate_visibility(self):
        stalker = Stalker("s1", 0.0, 0.0)

        # Test no target
        stalker.calculate_visibility(None)
        self.assertEqual(stalker.visibility, 0.1)

        # Test target close (distance < 300)
        target = Entity("t1", 150.0, 0.0, 10.0)
        stalker.calculate_visibility(target)
        self.assertGreater(stalker.visibility, 0.1)

        # Test target far (distance >= 300)
        target_far = Entity("t2", 400.0, 0.0, 10.0)
        stalker.calculate_visibility(target_far)
        self.assertEqual(stalker.visibility, 0.1)

        # Test fast movement
        stalker.velocity['x'] = 3.0
        stalker.calculate_visibility(target_far)
        self.assertGreater(stalker.visibility, 0.1)

    def test_stalker_move_towards(self):
        stalker = Stalker("s1", 0.0, 0.0)
        target = Entity("t1", 100.0, 0.0, 10.0)

        stalker.move_towards(target, dt=1.0)
        self.assertGreater(stalker.x, 0.0)
        self.assertEqual(stalker.y, 0.0)

        # Test when very close
        stalker.x = 96.0
        stalker.move_towards(target, dt=1.0)
        self.assertEqual(stalker.velocity['x'], 0)
        self.assertEqual(stalker.velocity['y'], 0)

    def test_stalker_hunt(self):
        stalker = Stalker("s1", 0.0, 0.0, 30.0)

        # Larger entity, should be ignored
        ent1 = Entity("e1", 100.0, 0.0, 40.0)

        # Smaller entity, should hunt
        ent2 = Entity("e2", 0.0, 100.0, 10.0)

        stalker.hunt([ent1, ent2], dt=1.0)

        # Should have moved towards ent2 (positive y direction)
        self.assertEqual(stalker.x, 0.0)
        self.assertGreater(stalker.y, 0.0)

        # Hunt with no valid prey (idle)
        stalker2 = Stalker("s2", 0.0, 0.0, 30.0)
        stalker2.velocity['x'] = 10.0
        stalker2.hunt([ent1], dt=1.0)
        self.assertEqual(stalker2.velocity['x'], 9.0) # Decays to 90%

if __name__ == '__main__':
    unittest.main()
