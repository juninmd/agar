from chronos import Player, AbilityEffects

def test_chronos_history_length():
    player = Player(100, 100, 'CHRONOS')

    for i in range(200):
        player.x += 1
        player.y += 1
        player.mass += 1
        player.update_history()

    assert len(player.history) == 180
    assert player.history[0]['x'] == 121
    assert player.history[-1]['x'] == 300

def test_chronos_rewind_logic():
    player = Player(10, 10, 'CHRONOS')

    # Store initial state implicitly
    for i in range(10):
        player.x += 10
        player.y += 10
        player.update_history()

    # State at index 0 should be x=20, y=20
    # Current state should be x=110, y=110
    assert player.x == 110

    # Trigger rewind
    AbilityEffects.trigger_chronos(player)

    # Should be back to oldest history state
    assert player.x == 20
    assert player.y == 20
    assert len(player.history) == 0

    # Should have a SHIELD powerup
    assert len(player.powerups) == 1
    assert player.powerups[0]['id'] == 'SHIELD'
    assert player.powerups[0]['duration'] == 30

def test_chronos_no_history():
    player = Player(10, 10, 'CHRONOS')
    # Trigger rewind with empty history
    AbilityEffects.trigger_chronos(player)

    # Should not change position
    assert player.x == 10
    assert player.y == 10
    assert len(player.powerups) == 0

def test_non_chronos_protocol_history():
    player = Player(10, 10, 'HACKER')
    player.x += 10
    player.update_history()

    assert len(player.history) == 0
