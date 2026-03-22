"""
Abyss Zones: Environmental hazards that obscure vision.
Deep Web data fields where light fails.
"""

import math
import random
from typing import List, Optional

class ObscuredEntity:
    """
    Wrapper for an entity to handle its obscured state within an AbyssZone.
    """
    def __init__(self, entity, is_obscured: bool = False):
        self.entity = entity
        self.is_obscured = is_obscured
        self.flicker_effect = 0.0

    def update_flicker(self, _dt: float = 0.0):
        """Adds a static noise flicker effect to obscured entities."""
        if self.is_obscured:
            self.flicker_effect = random.uniform(0.1, 0.4)
        else:
            self.flicker_effect = 1.0


class AbyssZone:
    """
    A terrain feature that reduces visibility of entities inside it.
    """
    def __init__(self, zone_id: str, x: float, y: float, radius: float, lifespan: float):
        self.zone_id = zone_id
        self.x = x
        self.y = y
        self.radius = radius
        self.lifespan = lifespan
        self.max_lifespan = lifespan
        self.active = True

    def contains(self, entity_x: float, entity_y: float) -> bool:
        """Checks if a given coordinate is within the Abyss Zone."""
        distance = math.hypot(self.x - entity_x, self.y - entity_y)
        return distance <= self.radius

    def apply_visibility_rules(self, entities: List[ObscuredEntity]):
        """
        Iterates over entities and obscures them if they are inside the zone.
        """
        if not self.active:
            return

        for obs_ent in entities:
            if self.contains(obs_ent.entity.x, obs_ent.entity.y):
                obs_ent.is_obscured = True
            else:
                # If they are not in this zone, they might still be in another,
                # but for simplicity, we let the zone manager handle overlaps.
                pass

    def update(self, dt: float):
        """Updates the zone's lifecycle (fading in/out)."""
        self.lifespan -= dt
        if self.lifespan <= 0:
            self.active = False

    def get_alpha(self) -> float:
        """Returns the opacity of the zone based on its lifecycle."""
        if not self.active:
            return 0.0

        alpha = 0.9
        FADE_TIME = 5000.0
        fade_in_factor = min(1.0, (self.max_lifespan - self.lifespan) / FADE_TIME)
        fade_out_factor = min(1.0, self.lifespan / FADE_TIME)
        alpha = 0.9 * min(fade_in_factor, fade_out_factor)
        return alpha


class AbyssManager:
    """
    Manages generation and updating of multiple Abyss Zones on the grid.
    """
    def __init__(self, world_width: float, world_height: float):
        self.zones: List[AbyssZone] = []
        self.world_width = world_width
        self.world_height = world_height
        self.max_zones = 3
        self.spawn_timer = 0.0
        self.spawn_interval = 30000.0  # 30 seconds

    def generate_zone(self):
        """Spawns a new Abyss Zone at random coordinates."""
        radius = random.uniform(300, 800)
        x = random.uniform(radius, self.world_width - radius)
        y = random.uniform(radius, self.world_height - radius)
        lifespan = random.uniform(60000, 120000)  # 1-2 minutes
        zone_id = f"abyss_{random.randint(0, 9999)}"

        new_zone = AbyssZone(zone_id, x, y, radius, lifespan)
        self.zones.append(new_zone)

    def update(self, entities: List[ObscuredEntity], dt: float):
        """Updates zones, handles spawning, and applies visibility rules."""
        # Handle spawning
        self.spawn_timer += dt
        if self.spawn_timer >= self.spawn_interval:
            self.spawn_timer = 0.0
            if len(self.zones) < self.max_zones:
                self.generate_zone()

        # Reset entity visibility before applying rules
        for obs_ent in entities:
            obs_ent.is_obscured = False

        # Update existing zones and apply rules
        active_zones = []
        for zone in self.zones:
            zone.update(dt)
            if zone.active:
                zone.apply_visibility_rules(entities)
                active_zones.append(zone)

        self.zones = active_zones

        # Update entity flicker effects
        for obs_ent in entities:
            obs_ent.update_flicker(dt)
