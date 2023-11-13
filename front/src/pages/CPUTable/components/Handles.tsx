import { Handle, HandleType, Position } from "react-flow-renderer";

export default function Handles({ data, id }: any) {

  return data.handlePos?.map((pos: string, index: number) => {
    const [handlePos, type, handlePosValue] = pos.split('-'); // top-target-50 (50% from left)
    
    return (
      <Handle
        key={`${id}-${handlePos}-${type}-${index}`}
        type={type as HandleType}
        position={handlePos as Position}
        style={{
          background: "#555",
          position: "absolute",
          left: `${handlePosValue}%`,
        }}
        isConnectable={false}
      />
    );
  }
  );
}
