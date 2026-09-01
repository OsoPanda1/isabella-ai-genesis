import pytest
from qup.workflows.toric_qec import ToricConfig, validate_toric_config


def test_toric_config():
    config = ToricConfig(lattice_size=3)
    assert config.physical_qubits == 18
    assert config.logical_qubits == 2
    assert config.distance == 3


def test_toric_invalid():
    with pytest.raises(ValueError):
        validate_toric_config(ToricConfig(lattice_size=1))
