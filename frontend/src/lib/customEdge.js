import { IconButton } from "@mui/material";
import React, { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "reactflow";
import {  HighlightOff } from "@mui/icons-material";
import { useStore } from "../store/store";
import { shallow } from "zustand/shallow";
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
 
  const [doubleClose, setDoubleClose] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  let buttonClassName = "cancel_btn";
  const selector = (state) => ({
    onEdgesChange: state.onEdgesChange,
    onRedHandles: state.onRedHandles,
  });
  const { onEdgesChange, onRedHandles } = useStore(selector, shallow);

  
  const onEdgeClick = () => {
    if (doubleClose) {
      onRedHandles(id, false);
      onEdgesChange([{ type: "remove", id }]);
    } else {
      setDoubleClose(true);
      onRedHandles(id, true);
      setTimeout(() => {
        setDoubleClose(false);
        onRedHandles(id, false);
      }, 3000);
    }
  };


  buttonClassName = doubleClose ? "cancel_btn red_button" : "cancel_btn";

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={doubleClose ? { stroke: "red", strokeWidth: 2 } : style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <IconButton
            className={buttonClassName}
            onClick={onEdgeClick}
            aria-label="cancel"
            size="small"
            color="secondary"
          >
            <HighlightOff />
          </IconButton>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
