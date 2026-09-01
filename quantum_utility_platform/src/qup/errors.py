class QuantumUtilityPlatformError(Exception):
    """Base error class for QUP."""


class PermissionError(QuantumUtilityPlatformError):
    """Raised when execution violates access controls."""


class ValidationError(QuantumUtilityPlatformError):
    """Raised when circuits exceed defined limits."""
