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
    sourceHandle: "databus-bottom-source-10",
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
    sourceHandle: "databus-bottom-source-80",
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
    targetHandle: "databus-bottom-target-90",
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
    sourceHandle: "databus-top-source-5",
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
    sourceHandle: "databus-top-source-45",
    targetHandle: 'RA-bottom-target-70'
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
    sourceHandle: "databus-top-source-72",
    targetHandle: 'RB-bottom-target-70'
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
    sourceHandle: "RA-top-source-70",
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
    sourceHandle: "RB-top-source-30",
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
];

export default initialEdges;