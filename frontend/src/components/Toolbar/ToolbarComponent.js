import { DraggableNode} from '../Node/DraggableNode';
import { nodes } from "../../lib/nodeCreation";

export const ToolbarComponent = () => {

  return (
    <div className="toolbar">
      {nodes.map((node, index) => (
          <DraggableNode key={`${node.type}-${index}`} {...node} />
      ))}
    </div>
    
  );
};
