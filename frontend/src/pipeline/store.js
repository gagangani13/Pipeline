// store.js
import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import toast from "react-hot-toast";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  connectedHandles: {},
  connectingHandle:null,
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  onNodesChange: (changes) => {
    set({
        nodes: applyNodeChanges(changes, get().nodes),
      });

  },
  onEdgesChange: (changes) => {
    const edges = get().edges;
    const connectedHandles = get().connectedHandles;
    const updatedEdges = applyEdgeChanges(changes, edges);
    const isHandleConnected = (handle, edges) => {
      return edges.some(edge => edge.sourceHandle === handle || edge.targetHandle === handle);
    };
    changes.forEach((change) => {
      if (change.type === "remove") {
        const edge = edges.find((edge) => edge.id === change.id);
        if (edge) {
          const { sourceHandle, targetHandle } = edge;
  
          // Check if sourceHandle and targetHandle should be deleted
          if (!isHandleConnected(sourceHandle, updatedEdges)) {
            delete connectedHandles[sourceHandle];
          }
          if (!isHandleConnected(targetHandle, updatedEdges)) {
            delete connectedHandles[targetHandle];
          }
        }
      }
    });

    set({ edges: updatedEdges });
    set(()=>({
      connectedHandles:{...connectedHandles}
    }))
  },
  onConnect: (connection) => {
    const connectedHandles=get().connectedHandles
    if (connectedHandles[`${connection.targetHandle}`]) {
      toast.error('Target handle is already in use');
      return;
    }
    if (connection.source===connection.target) {
      toast.error("Source and Target can't be from same Node");
      return
    }
    const updatedEdges = addEdge(
      {
        ...connection,
        type: "custom",
        animated: true,
        deletable: true,
        style: { stroke: "rgb(67, 11, 138)", strokeWidth: 2 },
      },
      get().edges
    );
    set({ edges: updatedEdges });
    // Update connected handles
    const { sourceHandle, targetHandle } = connection;
    set((state) => ({
      connectedHandles: {
        ...state.connectedHandles,
        [`${sourceHandle}`]: true,
        [`${targetHandle}`]: true,
      },
    }));
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },
  onRedHandles:(id,boolean)=>{
    const edges = get().edges
    const edge = edges.find((edge) => edge.id === id);
        if (edge) {
          const { sourceHandle, targetHandle } = edge;
          set((state) => ({
            redHandles: {
              ...state.redHandles,
              [`${sourceHandle}`]: boolean,
              [`${targetHandle}`]: boolean,
            },
          }));
        }
  },
  onConnectHandle: (handle=null) => {
    set({connectingHandle: handle})
  },
  onModifyHandle: (nodeId,handles) => {
    const nodes = get().nodes;
    let node = nodes.find((node) => node.id === nodeId);
    if (!node) {
      return
    }
    node={...node,data:{...node.data,handle:{...handles}}}
    set(nodes[nodeId]=node);
  }
}));