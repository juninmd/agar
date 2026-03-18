"""
Stalker Protocol: A stealth-based entity that thrives in the Deep Web Abyss.
Follows DRY and KISS principles.
"""

import math

class Entity:
    def __init__(self, entity_id: str, x: float, y: float, radius: float):
        self.entity_id = entity_id
        self.x = x
        self.y = y
        self.radius = radius
        self.velocity = {'x': 0.0, 'y': 0.0}
        self.mass = self.radius ** 2

    def check_collision(self, other: 'Entity') -> bool:
        """
        Simple bounding circle collision detection.
        Returns True if the entities overlap.
        """
        distance = math.hypot(self.x - other.x, self.y - other.y)
        return distance < (self.radius + other.radius)


class Stalker(Entity):
    """
    Stalker is a stealthy entity that has low visibility
    unless moving rapidly or close to its prey.
    """
    def __init__(self, entity_id: str, x: float, y: float, radius: float = 30.0):
        super().__init__(entity_id, x, y, radius)
        self.base_speed = 1.6
        self.visibility = 0.1  # 10% visible by default
        self.target = None

    def calculate_visibility(self, target_entity: Entity):
        """
        Visibility increases if moving fast or if close to a target.
        """
        if not target_entity:
            self.visibility = 0.1
            return

        distance = math.hypot(self.x - target_entity.x, self.y - target_entity.y)
        speed = math.hypot(self.velocity['x'], self.velocity['y'])

        target_alpha = 0.1
        if distance < 300:
            target_alpha = max(0.1, 1 - (distance / 300))
        if speed > 2:
            target_alpha = max(target_alpha, min(1.0, speed / 5))

        self.visibility = target_alpha

    def move_towards(self, target: Entity, dt: float):
        """
        Calculates velocity vector towards target and applies movement.
        """
        self.target = target
        distance = math.hypot(self.x - target.x, self.y - target.y)

        if distance > 5:
            dx = target.x - self.x
            dy = target.y - self.y

            # Normalize and apply speed
            self.velocity['x'] = (dx / distance) * self.base_speed
            self.velocity['y'] = (dy / distance) * self.base_speed
        else:
            self.velocity['x'] = 0
            self.velocity['y'] = 0

        # Apply velocity
        self.x += self.velocity['x'] * dt
        self.y += self.velocity['y'] * dt

        # Update visibility based on movement and target distance
        self.calculate_visibility(target)

    def hunt(self, entities: list[Entity], dt: float = 1.0):
        """
        Finds the closest entity smaller than itself and hunts it.
        """
        closest_prey = None
        min_dist = float('inf')

        for ent in entities:
            if ent.entity_id != self.entity_id and ent.mass < self.mass:
                dist = math.hypot(self.x - ent.x, self.y - ent.y)
                if dist < min_dist:
                    min_dist = dist
                    closest_prey = ent

        if closest_prey:
            self.move_towards(closest_prey, dt)
        else:
            # Idle movement logic
            self.velocity['x'] *= 0.9
            self.velocity['y'] *= 0.9
            self.x += self.velocity['x'] * dt
            self.y += self.velocity['y'] * dt
            self.calculate_visibility(None)
