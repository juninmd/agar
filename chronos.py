class Chronos:
    """
    Chronos Protocol: Manipulates the time offset.
    """
    def __init__(self):
        self.time_offset = 0

    def rewind(self, delta=1):
        """Adjusts the time offset backwards."""
        if not isinstance(delta, (int, float)):
            raise TypeError("Delta must be a number")
        self.time_offset += delta

    def reset(self):
        """Clears the time offset."""
        self.time_offset = 0

    def toggle(self):
        """Reverses time flow."""
        self.time_offset *= -1

    def describe(self, anomaly):
        """Describes the protocol's state in relation to an anomaly."""
        return f"Anomaly {anomaly.type} (time offset: {self.time_offset})"


class Anomaly:
    """
    Anomaly Entity: Represents a temporal distortion.
    """
    def __init__(self, anomaly_type):
        self.type = anomaly_type
