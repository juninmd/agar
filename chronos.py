class Player:
    def __init__(self, x, y, protocol):
        self.x = x
        self.y = y
        self.mass = 100
        self.radius = 20
        self.protocol = protocol
        self.history = []
        self.powerups = []

    def update_history(self):
        if self.protocol == 'CHRONOS':
            self.history.append({
                'x': self.x,
                'y': self.y,
                'mass': self.mass,
                'radius': self.radius
            })
            if len(self.history) > 180:
                self.history.pop(0)

    def apply_powerup(self, powerup_id, duration):
        self.powerups.append({'id': powerup_id, 'duration': duration})

class AbilityEffects:
    @staticmethod
    def trigger_chronos(player):
        if hasattr(player, 'history') and len(player.history) > 0:
            past_state = player.history[0]
            player.x = past_state['x']
            player.y = past_state['y']
            player.mass = past_state['mass']
            player.radius = past_state['radius']

            player.apply_powerup('SHIELD', 30)
            player.history = []
