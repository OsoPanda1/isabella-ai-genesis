from qup.routing import choose_addons


def test_choose_addons():
    addons = choose_addons(
        objective="hamiltonian_spectrum",
        circuit_depth=120,
        qubit_count=25,
        expects_observables=True,
        expects_samples=True,
    )
    assert "aqc_tensor" in addons
    assert "sqd" in addons
