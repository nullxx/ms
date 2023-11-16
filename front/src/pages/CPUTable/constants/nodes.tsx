import type { Node } from "../../../lib/ReactFlow";

const nodes: Node[] = [
  {
    "id": "RA",
    "position": {
      x: -212, y: -701
    },
    "draggable": false,
    "type": "registerNode",
    "data": {
      "labelKey": "ra.label",
      "readOnly": true,
      "getFunction": "get_register_alu_ra",
      "helpInfoKey": "ra.helpInfo",
      "handlePos": [
        "bottom-source-50",
        "top-target-70"
      ],

      "controlBusBitLoad": {
        "label": "CCA",
        "getFunction": "get_control_bus_next_ca"
      }
    }
  },
  {
    "id": "RB",
    "position": {
      x: -23, y: -701
    },
    "draggable": false,
    "type": "registerNode",
    "data": {
      "labelKey": "rb.label",
      "readOnly": true,
      "getFunction": "get_register_alu_rb",
      "helpInfoKey": "rb.helpInfo",
      "handlePos": [
        "bottom-source-50",
        "top-target-70"
      ],

      "controlBusBitLoad": {
        "label": "CCB",
        "getFunction": "get_control_bus_next_cb"
      }
    }
  },
  {
    "id": "pc",
    "position": {
      x: -763, y: -421
    },
    "draggable": false,
    "type": "registerNode",
    "data": {
      "labelKey": "pc.label",
      "readOnly": true,
      "handlePos": [
        "top-target-70",
        "right-target-50",
        "bottom-source-50",
      ],

      "width": 70,
      "height": 63,
      "controlBusBitLoad": {
        "label": "CPC",
        "getFunction": "get_control_bus_next_cpc"
      },
      "getFunction": "get_register_pc",
      "helpInfoKey": "pc.helpInfo"
    }
  },
  {
    "id": "8",
    "data": {
      "labelKey": "controlunit.label",
      "width": 440,
      "height": 200
    },
    "draggable": false,
    "position": {
      x: -1121, y: -677
    },
    "className": "light",
    "type": "loadableNode",
    "isParent": true
  },
  {
    "id": "ri",
    "position": {
      "x": 20,
      "y": 40
    },
    "parentNode": "8",
    "draggable": false,
    "type": "riNode",
    "data": {
      "labelKey": "ri.label",
      "readOnly": true,
      "width": 70,
      "height": 63,
      "handlePos": [
        "top-target-10",
        "top-source-5",
        "top-source-10"
      ],

      "controlBusBitLoad": {
        "label": "CRI",
        "getFunction": "get_control_bus_next_cri"
      },
      "getFunction": "get_register_ri",
      "helpInfoKey": "ri.helpInfo"
    }
  },
  {
    "id": "8b",
    "position": {
      "x": 140,
      "y": 125
    },
    "parentNode": "8",
    "draggable": false,
    "type": "registerNode",
    "data": {
      "labelKey": "state.label",
      "readOnly": true,
      "width": 70,
      "height": 63,
      "getFunction": "get_state"
    }
  },
  {
    "id": "memory",
    "position": {
      x: -489, y: -634
    },
    "type": "memoryNode",
    "draggable": false,
    "data": {
      "labelKey": "memory.label",
      "readOnly": false,
      "width": 300,
      "helpInfoKey": "memory.helpInfo"
    }
  },
  {
    "id": "transition-state",
    "position": {
      x: -1016, y: -421
    },
    "type": "stateTransition",
    "data": {
      "labelKey": "transitionstate.label"
    },
    "draggable": false,
  },
  {
    "id": "debugger",
    "position": {
      x: 23, y: -463
    },
    "type": "debuggerNode",
    "data": {
      "labelKey": "debugger.label"
    },
    "draggable": false,
  },
  {
    "id": "variables",
    "position": {
      x: 268, y: -464.00000000000006
    },
    "type": "variablesNode",
    "data": {
      "labelKey": "variables.label"
    },
    "draggable": false,
  },
  {
    "id": "flags",
    "position": {
      x: 171, y: -565
    },
    "draggable": false,
    "type": "flagsNode",
    "data": {
      "labelKey": "flags.label",
      "helpInfoKey": "flags.helpInfo",
      "fzHelpInfoKey": "flags.fzHelpInfo",
      "fcHelpInfoKey": "flags.fcHelpInfo"
    }
  },
  {
    "id": "clockCycleTime",
    "position": {
      x: -624, y: -739
    },
    "draggable": false,
    "type": "cycleTimeNode",
    "data": {
      "labelKey": "clockCycleTime.label"
    }
  },
  {
    "id": "alu",
    "position": {
      x: -131, y: -574
    },
    "draggable": false,
    "type": "aluNode",
    "data": {
      "labelKey": "alu.label",
      "handlePos": [
        "top-target-50"
      ],

    }
  },
  {
    "id": "databus",
    "position": {
      x: -999, y: -814
    },
    "draggable": false,
    "type": "busNode",
    "data": {
      "labelKey": "databus.label",
      "width": 1200,
      "getFunction": "get_data_bus"
    }
  },
  {
    "id": "automata",
    "position": {
      x: -295, y: -463
    },
    "draggable": false,
    "type": "automataNode",
    "data": {
      "labelKey": "automata.label",
      "width": 300,
      "height": 416
    }
  },
  {
    "id": "mx",
    "position": {
      x: -614, y: -329
    },
    "draggable": false,
    "type": "mxNode",
    "data": {
      "labelKey": "mx.label",
      "width": 180,
      "height": 240
    }
  },
  {
    "id": "inc",
    "position": {
      x: -427, y: -421
    },
    "draggable": false,
    "type": "incNode",
    "data": {
      "labelKey": "inc.label",
      "width": 60,
      "height": 60
    }
  }
];
export default nodes;
