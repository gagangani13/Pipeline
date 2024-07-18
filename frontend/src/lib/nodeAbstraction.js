export const handleCreate = (type, handleId,position) => {
  return { type, handleId,position };
};
export const createNode = (type, label, description, iconType, icon) => {
  return { type, label, description, iconType, icon };
};
// Function to generate input objects for a form
export const generateInput = (label, type, others = {}) => {
  const {
    required = false,
    placeholder = "",
    maxLength,
    minLength,
    min,
    max,
    step,
    options: selectOptions,
  } = others;

  // Common attributes for all input types
  const inputObject = {
    label,
    type,
    required,
    placeholder,
  };

  // Additional attributes based on input type
  switch (type) {
    case "text":
    case "input":
    case "inputHandle":
    case "email":
    case "password":
    case "number":
    case "date":
    case "file":
    case "color":
    case "textarea":
    case "variableText":
      if (maxLength) inputObject.maxLength = maxLength;
      if (minLength) inputObject.minLength = minLength;
      break;
    case "range":
      if (min) inputObject.min = min;
      if (max) inputObject.max = max;
      if (step) inputObject.step = step;
      break;
    case "select":
    case "checkbox":
    case "radio":
      if (selectOptions && Array.isArray(selectOptions)) {
        inputObject.options = selectOptions;
      }
      break;
    default:
      throw new Error(`Unsupported input type in generateInput: ${type}`);
  }

  return inputObject;
};
