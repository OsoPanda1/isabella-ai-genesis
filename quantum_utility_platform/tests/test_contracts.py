from qup.contracts import ExecutionMode, WorkflowStage


def test_contracts_exist():
    assert ExecutionMode.SIMULATOR == "simulator"
    assert WorkflowStage.MAP == "map"
