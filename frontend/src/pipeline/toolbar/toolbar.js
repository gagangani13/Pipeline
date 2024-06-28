import { DraggableNode } from "../nodes/draggableNode";
import { nodes } from "../nodes/nodeCreation";

export const PipelineToolbar = () => {

  return (
    <div className="toolbar">
      {nodes.map((node, index) => (
          <DraggableNode key={`${node.type}-${index}`} {...node} />
      ))}
    </div>
    
  );
};
