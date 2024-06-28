import { Fade, Paper, Popper, Typography } from "@mui/material";
import { useState } from "react";

// draggableNode.js
export const DraggableNode = ({
  type,
  label,
  iconType,
  icon,
  description,
  ...data
}) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType, label, iconType, icon, ...data };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <>
      <div
        className="node_box"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="node_icon"
          onDragStart={(event) => onDragStart(event, type)}
          onDragEnd={(event) => (event.target.style.cursor = "grab")}
          draggable
        >
          {iconType==='class' && <i class={icon + " icon_small"}></i>}
          {iconType==='image' && (
            <img src={icon} className="icon_img" alt="" />
          )}
          <span className="node_name">{label}</span>
        </div>
      </div>
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [20, 12], // Change 10 to the desired gap value
            },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography
                sx={{ p: 2, m: 0, fontFamily: "inherit" }}
              >
                <Typography
                  component="p"
                  variant="body1"
                  sx={{ m: 0, fontFamily: "inherit", color: "grey",fontSize:14,fontWeight:600 }}
                >
                  {label} Node
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ m: 0, fontFamily: "inherit",fontSize:14,fontWeight:400 }}
                >
                  {description}
                </Typography>
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};
