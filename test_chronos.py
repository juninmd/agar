import pytest
from chronos import Chronos, Anomaly

def test_chronos_rewind():
    chronos = Chronos()
    chronos.rewind(5)
    assert chronos.time_offset == 5

def test_chronos_rewind_default():
    chronos = Chronos()
    chronos.rewind()
    assert chronos.time_offset == 1

def test_chronos_reset():
    chronos = Chronos()
    chronos.rewind(10)
    chronos.reset()
    assert chronos.time_offset == 0

def test_chronos_toggle():
    chronos = Chronos()
    chronos.rewind(3)
    chronos.toggle()
    assert chronos.time_offset == -3

def test_anomaly_describe():
    chronos = Chronos()
    chronos.rewind(5)
    anomaly = Anomaly("TIME_LOOP")
    description = chronos.describe(anomaly)
    assert description == "Anomaly TIME_LOOP (time offset: 5)"

def test_invalid_rewind():
    chronos = Chronos()
    with pytest.raises(TypeError):
        chronos.rewind("invalid")
