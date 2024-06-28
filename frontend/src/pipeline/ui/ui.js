// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ReactFlowProvider } from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import 'reactflow/dist/style.css';
import { NodeComponent } from '../nodes/NodeComponent';
import { nodeTypeNames } from '../nodes/nodeCreation';
import CustomEdge from './edges/customEdge';
const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onConnectHandle: state.onConnectHandle
});

export const PipelineUI = () => {

  const nodeTypes = useMemo(() => {
    return nodeTypeNames.reduce((types, typeName) => {
      types[typeName] = NodeComponent;
      return types;
    }, {});
  }, []);
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    let {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onConnectHandle
    } = useStore(selector, shallow);

    useEffect(() => {
      const handleMouseUp = (event) => {
        onConnectHandle(null)
      };
  
      const reactFlowElement = reactFlowWrapper.current;
  
      if (reactFlowElement) {
        reactFlowElement.addEventListener('mouseup', handleMouseUp);
  
        // Cleanup function to remove the event listener when the component unmounts
        return () => {
          reactFlowElement.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, []);


    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
            // const handle = appData?.handle;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data:appData,
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    return (
        <>
        <div ref={reactFlowWrapper} style={{width: '100wv', height: '70vh'}}>
          <ReactFlowProvider>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                edgeTypes={edgeTypes}
                connectionLineStyle={{ stroke: 'rgb(67, 11, 138)', strokeWidth: 1,strokeDasharray: '5, 5'}}
                connectOnClick={false}
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
            </ReactFlowProvider>
        </div>
        </>
    )
}
