import type { Node } from "../../../lib/ReactFlow";

const nodes: Node[] = [
  {
    "id": "RA",
    "position": {
      "x": -352,
      "y": -365
    },
    "draggable": true,
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
      "handlesCount": 2,
      "controlBusBitLoad": {
        "label": "CCA",
        "getFunction": "get_control_bus_next_ca"
      }
    }
  },
  {
    "id": "RB",
    "position": {
      "x": -162,
      "y": -368
    },
    "draggable": true,
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
      "handlesCount": 2,
      "controlBusBitLoad": {
        "label": "CCB",
        "getFunction": "get_control_bus_next_cb"
      }
    }
  },
  {
    "id": "pc",
    "position": {
      "x": -904,
      "y": -315
    },
    "draggable": true,
    "type": "registerNode",
    "data": {
      "labelKey": "pc.label",
      "readOnly": true,
      "handlePos": [
        "top-target-70"
      ],
      "handlesCount": 1,
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
    "draggable": true,
    "position": {
      x: -756, y: -162
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
    "draggable": true,
    "type": "riNode",
    "data": {
      "labelKey": "ri.label",
      "readOnly": true,
      "width": 70,
      "height": 63,
      "handlePos": [
        "top-target-10"
      ],
      "handlesCount": 1,
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
    "draggable": true,
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
      "x": -671,
      "y": -356
    },
    "type": "memoryNode",
    "draggable": true,
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
      x: 453, y: -458
    },
    "type": "stateTransition",
    "data": {
      "labelKey": "transitionstate.label"
    },
    "draggable": true
  },
  {
    "id": "debugger",
    "position": {
      "x": -1027,
      "y": -229
    },
    "type": "debuggerNode",
    "data": {
      "labelKey": "debugger.label"
    },
    "draggable": true
  },
  {
    "id": "variables",
    "position": {
      x: -295, y: -135
    },
    "type": "variablesNode",
    "data": {
      "labelKey": "variables.label"
    },
    "draggable": true
  },
  {
    "id": "flags",
    "position": {
      x: 4, y: -235
    },
    "draggable": true,
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
      "x": -1030,
      "y": -455
    },
    "draggable": true,
    "type": "cycleTimeNode",
    "data": {
      "labelKey": "clockCycleTime.label"
    }
  },
  {
    "id": "alu",
    "position": {
      x: -280, y: -244
    },
    "draggable": true,
    "type": "aluNode",
    "data": {
      "labelKey": "alu.label",
      "handlePos": [
        "top-target-50"
      ],
      "handlesCount": 1
    }
  },
  {
    "id": "databus",
    "position": {
      "x": -758,
      "y": -456
    },
    "draggable": true,
    "type": "busNode",
    "data": {
      "labelKey": "databus.label",
      "width": 800,
      "getFunction": "get_data_bus"
    }
  },
  {
    "id": "automata",
    "position": {
      x: 134, y: -458
    },
    "draggable": true,
    "type": "automataNode",
    "data": {
      "labelKey": "automata.label",
      "width": 300,
      "height": 416
    }
  }
];
export default nodes;
