import { memo } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProps,
} from "react-flow-renderer";

export interface Point {
  x: number;
  y: number;
}

function Flow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  fitView,
  fitViewOptions,
  nodeTypes,
  edgeTypes,
  connectionLineComponent,
}: {
  nodes: ReactFlowProps["nodes"];
  edges: ReactFlowProps["edges"];
  onNodesChange?: ReactFlowProps["onNodesChange"];
  onEdgesChange?: ReactFlowProps["onEdgesChange"];
  onConnect?: ReactFlowProps["onConnect"];
  fitView?: ReactFlowProps["fitView"];
  fitViewOptions?: ReactFlowProps["fitViewOptions"];
  nodeTypes?: ReactFlowProps["nodeTypes"];
  edgeTypes?: ReactFlowProps["edgeTypes"];
  connectionLineComponent?: ReactFlowProps["connectionLineComponent"];
}) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView={fitView}
      fitViewOptions={fitViewOptions}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionLineComponent={connectionLineComponent}
    >
      <Background />
      <Controls showInteractive={false} />

    </ReactFlow>
  );
}

export default memo(Flow, (prev, next) => {
  return (
    JSON.stringify(prev.nodes) === JSON.stringify(next.nodes) &&
    JSON.stringify(prev.edges) === JSON.stringify(next.edges) &&
    prev.onNodesChange === next.onNodesChange &&
    prev.onEdgesChange === next.onEdgesChange &&
    prev.onConnect === next.onConnect &&
    prev.fitView === next.fitView &&
    prev.fitViewOptions === next.fitViewOptions &&
    prev.nodeTypes === next.nodeTypes &&
    prev.edgeTypes === next.edgeTypes &&
    prev.connectionLineComponent === next.connectionLineComponent
  );
});

export {
  applyEdgeChanges,
  applyNodeChanges,
  getBezierPath,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";

export type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
  EdgeChange,
  NodeTypes,
  ConnectionLineComponentProps,
} from "react-flow-renderer";
