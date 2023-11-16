import { Edge, MarkerType } from "../../../lib/ReactFlow";

const initialEdges: Edge[] = [
  {
    id: "databus-ri",
    source: "databus",
    target: "ri",
    animated: false,
    type: "smoothstep",
    zIndex: 1,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-8",
  },
  {
    id: "databus-memory",
    source: "databus",
    target: "memory",
    animated: true, // always animated because is always passing data to memory
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-50",
  },
  {
    id: "memory-databus",
    source: "memory",
    target: "databus",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 80,
      type: MarkerType.Arrow,
    },
    targetHandle: "databus-bottom-target-60",
  },
  {
    id: "databus-pc",
    source: "databus",
    target: "pc",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-28",
  },
  {
    id: "databus-ra",
    source: "databus",
    target: "RA",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-76",
    targetHandle: 'RA-top-target-70'
  },
  {
    id: "databus-rb",
    source: "databus",
    target: "RB",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-90",
    targetHandle: 'RB-top-target-70'
  },
  {
    id: "RA-alu",
    source: "RA",
    target: "alu",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "A",
    sourceHandle: "RA-bottom-source-70",
    targetHandle: 'alu-input-A'
  },
  {
    id: "RB-alu",
    source: "RB",
    target: "alu",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "B",
    sourceHandle: "RB-bottom-source-30",
    targetHandle: 'alu-input-B'
  },
  {
    id: "alu-flagsfz",
    source: "alu",
    target: "flags",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "FZ",
    sourceHandle: "alu-output-FZ",
    targetHandle: 'flags-input-FZ'
  },
  {
    id: "pc-mx-01",
    source: "pc",
    target: "mx",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "PC",
    sourceHandle: "pc-bottom-source-50",
    targetHandle: 'mx-01'
  },
  {
    id: "ri-mx-10",
    source: "ri",
    target: "mx",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "SRC",
    sourceHandle: "ri-top-source-5",
    targetHandle: 'mx-10'
  },
  {
    id: "ri-mx-11",
    source: "ri",
    target: "mx",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "DST",
    sourceHandle: "ri-top-source-10",
    targetHandle: 'mx-11'
  },
  {
    id: "mx-inc",
    source: "mx",
    target: "inc",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "PC",
    sourceHandle: "mx-out",
    targetHandle: 'inc-in'
  },
  {
    id: "inc-pc",
    source: "inc",
    target: "pc",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "PC + 1",
    sourceHandle: "inc-out",
    targetHandle: 'pc-right-target-50'
  },
  {
    id: "mx-memory",
    source: "mx",
    target: "memory",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "DIR",
    sourceHandle: "mx-out",
    targetHandle: 'mem-dir'
  },
];

export default initialEdges;
