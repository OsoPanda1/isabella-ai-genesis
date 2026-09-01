from .addons import OptionalAddon


def register_default_addons(registry) -> None:
    addon_names = [
        "optimization_mapper",
        "fermionic_mapper",
        "aqc_tensor",
        "mpf",
        "operator_backpropagation",
        "circuit_cutting",
        "propagated_noise_absorption",
        "shaded_lightcones",
        "sqd",
        "sqd_hpc",
        "postselection_bit_flip",
        "mthree",
        "paulice",
    ]

    for name in addon_names:
        registry.register(
            name,
            lambda name=name: OptionalAddon(name),
        )
