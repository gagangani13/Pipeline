import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  TextField,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TextareaAutosize,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import "./FormComponent.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useStore } from "../../store";
import { handleCreate } from "../nodeAbstraction";
import { getConnectedEdges, useReactFlow } from "reactflow";
const FormComponent = ({ data, nodeId, setHandles,onInputHandle }) => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const handleChange = (event, newValue) => {
    const { name, value } = event.target;
    const uniqueName = `${nodeId}_${name}`; // Combine nodeId and name to create a unique identifier

    setFormData((prevFormData) => ({
      ...prevFormData,
      [uniqueName]: newValue || value,
    }));
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const [previousHandles, setPreviousHandles] = useState([]);
  const [inputText, setInputText] = useState("");
  const onModifyHandle = useStore((state) => state.onModifyHandle);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const handleInputChange = (event) => {
    const newText = event.target.value;

    setInputText(newText);

    // Regular expression to find all variables in double curly braces
    const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    let matches;
    const foundVariables = [];

    // Iterate over all matches found in the input text
    while ((matches = regex.exec(newText)) !== null) {
      foundVariables.push(matches[1]); // Pushing matched variable name
    }
    const handleIds = [...new Set(foundVariables)];
    const newHandles = handleIds.reduce((acc, handleId) => {
      return [handleCreate("target", handleId, "left"), ...acc];
    }, []);
    let isDifferent =
      previousHandles.length !== newHandles.length ||
      previousHandles.some(
        (handle, index) => handle.id !== newHandles[index].id
      );
    if (event.type === "paste") {
      isDifferent = true;
    }
    if (isDifferent) {
      const allHandles = [ ...data.handle, ...newHandles ]
      onModifyHandle(nodeId, allHandles);
      setHandles(allHandles);
      setPreviousHandles(newHandles);
      let allHandleIds = allHandles.map((handle) => {
        return `${nodeId}-${handle.handleId}-${handle.type}`;
      });
      removeEdges(nodeId, allHandleIds);
    }
  };

  const { getNodes, getEdges } = useReactFlow();
  function removeEdges(nodeId, handleIds) {
    let connectedEdges = getConnectedEdges(getNodes(), getEdges());
    connectedEdges = connectedEdges.filter((edge) => {
      return edge.source === nodeId || edge.target === nodeId;
    });

    const edges = connectedEdges.filter((edge) => {
      return (
        !handleIds.includes(edge.sourceHandle) &&
        !handleIds.includes(edge.targetHandle)
      );
    });

    onEdgesChange(
      edges.map((edge) => ({ type: "remove", id: edge.id }))
    );
  }
const inputHandle = (event) => {
  const handles=data.handle.map((item)=>{
    if (item.handleId==='value'){
      return {...item,handleId:event.target.value}
    }
    return item})
  onInputHandle(handles)
}
  return (
    <Container maxWidth="md">
      <form>
        {data?.form?.map((item, index) => (
          <FormControl
            key={index}
            fullWidth
            margin="normal"
            className="nodrag nopan"
          >
            <FormLabel className="form_label">{item.label}</FormLabel>

            {/* For Input */}
            {item.type === "input" && (
              <TextField
                id={`outlined-size-small-${index}`}
                size="small"
                variant="outlined"
                fullWidth
              />
            )}
            {/* For Input with Handle*/}
            {item.type === "inputHandle" && (
              <TextField
                id={`outlined-size-small-${index}`}
                size="small"
                variant="outlined"
                fullWidth
                onChange={inputHandle}
              />
            )}

            {/* For Select with AutoComplete */}
            {item.type === "select" && (
              <Autocomplete
                value={formData[item?.name] || item.options[0]}
                onChange={(event, newValue) => handleChange(event, newValue)}
                options={item.options}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" fullWidth />
                )}
              />
            )}

            {/* For Checkbox */}
            {item.type === "checkbox" && (
              <FormGroup>
                {item.options.map((option, idx) => (
                  <FormControlLabel
                    key={idx}
                    control={<Checkbox color="primary" />}
                    label={option.label}
                  />
                ))}
              </FormGroup>
            )}

            {/* For Radio Group */}
            {item.type === "radio" && (
              <RadioGroup
                aria-label={item.label}
                name={`radio-${index}`}
                value={formData[item.name] || ""}
                onChange={(event, newValue) => handleChange(event, newValue)}
              >
                {item.options.map((option, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={option.value}
                    control={<Radio color="primary" />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}

            {/* For Textarea */}
            {item.type === "textarea" && (
              <TextareaAutosize
                aria-label={item.label}
                placeholder={item.placeholder}
                spellCheck="false"
                className="custom-textarea"
              />
            )}
            {/* For convertable variable */}
            {item.type === "variableText" && (
              <TextareaAutosize
                aria-label={item.label}
                placeholder={item.placeholder}
                spellCheck="false"
                className="custom-textarea"
                value={inputText}
                onChange={handleInputChange}
                onPaste={handleInputChange}
              />
            )}

            {/* For File Upload */}
            {item.type === "file" && (
              <Box display="flex" alignItems="center">
                <input
                  accept="image/*, application/pdf"
                  style={{ display: "none" }}
                  id={`file-upload-${index}`}
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor={`file-upload-${index}`}>
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload {item.label}
                  </Button>
                </label>
                {file && <Typography variant="body1">{file.name}</Typography>}
              </Box>
            )}

            <FormHelperText>{item.helperText}</FormHelperText>
          </FormControl>
        ))}
      </form>
    </Container>
  );
};

export default FormComponent;
