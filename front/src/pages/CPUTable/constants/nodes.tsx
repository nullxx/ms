import type { Node } from "../../../lib/ReactFlow";

const nodes: Node[] = [
  {
    id: "RA",
    position: { x: -480, y: -254 },
    draggable: false,
    type: "registerNode",
    data: {
      labelKey: "ra.label",
      readOnly: true,
      getFunction: "get_register_alu_ra",
      helpInfoKey: "ra.helpInfo",
      handlePos: ["bottom", "top"],
      handlesCount: 2,
      controlBusBitLoad: {
        label: "CCA",
        getFunction: "get_control_bus_ca",
      },
    },
  },
  {
    id: "RB",
    position: { x: -280, y: -254 },
    draggable: false,
    type: "registerNode",
    data: {
      labelKey: "rb.label",
      readOnly: true,
      getFunction: "get_register_alu_rb",
      helpInfoKey: "rb.helpInfo",
      handlePos: ["bottom", "top"],
      handlesCount: 2,
      controlBusBitLoad: {
        label: "CCB",
        getFunction: "get_control_bus_cb",
      },
    },
  },
  {
    id: "pc",
    position: { x: -751, y: -226 },
    draggable: false,
    type: "registerNode",
    data: {
      labelKey: "pc.label",
      readOnly: true,
      handlePos: ["bottom"],
      handlesCount: 1,
      width: 70,
      height: 63,
      controlBusBitLoad: {
        label: "CPC",
        getFunction: "get_control_bus_cpc",
      },
      getFunction: "get_register_pc",
      helpInfoKey: "pc.helpInfo",
    },
  },
  {
    id: "8",
    data: {
      labelKey: "controlunit.label",
      width: 400,
      height: 120,
    },
    draggable: false,
    position: { x: -787, y: 62 },
    className: "light",
    type: "loadableNode",
    isParent: true,
  },

  {
    id: "ri",
    position: { x: 20, y: 40 },
    parentNode: "8",
    draggable: false,
    type: "registerNode",
    data: {
      labelKey: "ri.label",
      readOnly: true,
      width: 70,
      height: 63,
      handlePos: ["top"],
      handlesCount: 1,
      controlBusBitLoad: {
        label: "CRI",
        getFunction: "get_control_bus_cri",
      },
      getFunction: "get_register_ri",
      helpInfoKey: "ri.helpInfo",
    },
  },
  {
    id: "8b",
    position: { x: 200, y: 40 },
    parentNode: "8",
    draggable: false,
    type: "registerNode",
    data: {
      labelKey: "state.label",
      readOnly: true,
      width: 70,
      height: 63,
      getFunction: "get_state", // realmente lo que mostramos es el D'2, D'1, D'0, que es como el índice. El estado no se corresponde con ese indice. Por lo que un D'2, D'1, D'0 de 111 no es el estado 7 sino que es el 10. Esto se puede saber con la tabla de verdad del secuenciador.
    },
  },
  {
    id: "memory",
    position: { x: -300, y: 54 },
    type: "memoryNode",
    draggable: false,
    data: {
      labelKey: "memory.label",
      readOnly: false,
      width: 300,
      helpInfoKey: "memory.helpInfo",
    },
  },
  {
    id: "transition-state",
    position: { x: -1028, y: 141 },
    type: "stateTransition",
    data: {
      labelKey: "transitionstate.label",
    },
    draggable: false,
  },
  {
    id: "debugger",
    position: { x: -1027, y: -229 },
    type: "debuggerNode",
    data: {
      labelKey: "debugger.label",
    },
    draggable: false,
  },
  {
    id: "variables",
    // position: { x: -260, y: 54 },
    position: { x: 100, y: -323 },
    type: "variablesNode",
    data: {
      labelKey: "variables.label",
    },
    draggable: false,
  },
  {
    id: "flags",
    position: { x: -130, y: -410 },
    draggable: false,
    type: "flagsNode",
    data: {
      labelKey: "flags.label",
      helpInfoKey: "flags.helpInfo",
      fzHelpInfoKey: "flags.fzHelpInfo",
      fcHelpInfoKey: "flags.fcHelpInfo",
    },
  },
  {
    id: "clockCycleTime",
    position: { x: -777, y: 207 },
    draggable: false,
    type: "cycleTimeNode",
    data: {
      labelKey: "clockCycleTime.label",
    },
  },
  {
    id: "alu",
    position: { x: -400, y: -423 },
    draggable: false,
    type: "aluNode",
    data: {
      labelKey: "alu.label",
      handlePos: ["bottom"],
      handlesCount: 2,
    },
  },
  {
    id: "databus",
    position: { x: -760, y: -100 },
    draggable: false,
    type: "busNode",
    data: {
      labelKey: "databus.label",
      width: 800,
      getFunction: "get_data_bus",
    },
  },
];
export default nodes;
