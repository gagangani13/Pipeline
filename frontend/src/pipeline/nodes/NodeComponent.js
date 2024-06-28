// textNode.js
import {
  MenuItem,
  Popover,
  Typography,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {  useState } from "react";
import { Handle, Position, getConnectedEdges, useReactFlow, useUpdateNodeInternals } from "reactflow";
import "./nodes.css";
import {
  Close,
  ContentCopy,
  Delete,
  HighlightOff,
  Settings,
} from "@mui/icons-material";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";
import FormComponent from "./FormComponent/FormComponent";
// import SlateEditor from "./slate-editor/slateEditor";

export const NodeComponent = ({ id,data }) => {
  const selector = (state) => ({
    onEdgesChange: state.onEdgesChange,
    getNodeID: state.getNodeID,
    addNode: state.addNode,
    connectingHandle: state.connectingHandle,
    onConnectHandle: state.onConnectHandle,
    connectedHandles: state.connectedHandles,
    redHandles: state.redHandles,
    nodes: state.nodes,
  });
  const {
    onEdgesChange,
    getNodeID,
    addNode,
    onConnectHandle,
    connectedHandles,
    redHandles,
    connectingHandle,
  } = useStore(selector, shallow);
  const { getNodes, getEdges, setNodes } = useReactFlow();
  const [handles, setHandles] = useState(data.handle || []);
  let buttonClassName = "close_btn";
  const [doubleClose, setDoubleClose] = useState(false);
  const updateNodeInternals = useUpdateNodeInternals();
  const [pos, setPos] = useState(5);

  const onRemoveNode = (context = false) => {
    if (doubleClose || context === true) {
      let connectedEdges = getConnectedEdges(getNodes(), getEdges());
      connectedEdges = connectedEdges.filter((edge) => {
        return edge.source === id || edge.target === id;
      });
      console.log(connectedEdges);
      onEdgesChange(
        connectedEdges.map((edge) => ({ type: "remove", id: edge.id }))
      );
      setNodes(getNodes().filter((node) => node.id !== id));
    } else {
      setDoubleClose(true);
      setTimeout(() => setDoubleClose(false), 3000);
    }
  };
  buttonClassName = doubleClose ? "close_btn red_button" : "close_btn";

  const [anchorEl, setAnchorEl] = useState(null);

  const openSettings = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeSettings = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const closeContext = () => {
    setContextMenu(null);
  };

  const duplicateNode = () => {
    const existingNode = getNodes().find((node) => node.id === id);
    const newNode = {
      ...existingNode,
      id: getNodeID(existingNode.type),
      position: {
        x: existingNode.position.x + 100,
        y: existingNode.position.y + 100,
      },
      selected: false,
    };
    addNode(newNode);
  };
  const renderHandles = (handles) => {
    const typeCounts = handles.reduce((acc, item) => {
      const { position } = item;
      if (acc[position]) {
        acc[position] += 1;
      } else {
        acc[position] = 1;
      }
      return acc;
    }, {});
    let positionIndex = {};
    return handles.map((item, index) => {
      if (!positionIndex[item.position]) {
        positionIndex[item.position] = 0;
      }
      positionIndex[item.position] += 1;
      const topPosition = `${(positionIndex[item.position] / (typeCounts[item.position] + 1)) * 100}%`;
      const handleId = `${id}-${item.handleId}-${item.type}`;
      const isConnectable =
        connectedHandles[handleId] && handleId.includes("target")
          ? false
          : true;

      return (
        <Handle
          key={handleId}
          type={item.type}
          position={item.position}
          id={handleId}
          style={{ top: topPosition }}
          onMouseDownCapture={() =>
            onConnectHandle({ type: item.type, nodeId: id, isConnectable })
          }
          isConnectable={isConnectable}
          className={`handle-point ${
            connectedHandles && connectedHandles[handleId] ? "connected" : ""
          } ${redHandles && redHandles[handleId] ? "red_handle" : ""} ${
            connectingHandle &&
            item.type !== connectingHandle.type &&
            id !== connectingHandle.nodeId &&
            isConnectable
              ? "beacon"
              : ""
          }`}
        >
          <span
            style={{
              [item.position === Position.Left ? "right" : "left"]: "1.5em",
              position: "absolute",
              fontSize: "12px",
            }}
          >
            {item.handleId}
          </span>
        </Handle>
      );
    });
  };
  const onSetHandles = (handles) => {
    setHandles(handles);
    setPos(pos + 5);
    updateNodeInternals(id);
  }
  const onInputHandle= (handle) => {
    setHandles(handle);
  }
 
  return (
    <div className="node_content" onContextMenu={handleContextMenu} id={id}>
      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={closeContext}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          key="copy"
          onClick={() => {
            closeContext();
            duplicateNode();
          }}
        >
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText style={{ fontFamily: "inherit" }}>
            Duplicate
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeContext();
            onRemoveNode(true);
          }}
          key="delete"
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText style={{ fontFamily: "inherit" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <div>
        {/* Handles */}
        {renderHandles(handles)}
        {/* Layout */}
        <div className="node_head">
          <div className="title_box">
            {data.iconType === "class" && (
              <i className={data.icon + " sm_icon"}></i>
            )}
            {data.iconType === "image" && (
              <img src={data.icon} className="sm_icon" alt="" />
            )}
            <span className="titl_lbl">{data.label}</span>
          </div>
          <div className="d-flex">
            <IconButton
              onClick={openSettings}
              aria-label="settings"
              size="small"
            >
              <Settings />
            </IconButton>
            <Popover
              id={popoverId}
              open={open}
              anchorEl={anchorEl}
              onClose={closeSettings}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Typography sx={{ p: 2 }}>
                <div className="node_head">
                  <span className="titl_lbl mx-2">Advanced Settings</span>
                  <IconButton
                    onClick={closeSettings}
                    aria-label="close"
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </div>
              </Typography>
            </Popover>
            <IconButton
              className={buttonClassName}
              onClick={onRemoveNode}
              aria-label="cancel"
              size="small"
            >
              <HighlightOff />
            </IconButton>
          </div>
        </div>
        <FormComponent data={data} nodeId={id} setHandles={onSetHandles} onInputHandle={onInputHandle} />
      </div>
    </div>
  );
};
