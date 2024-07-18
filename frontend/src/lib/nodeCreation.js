import { createNode, handleCreate, generateInput } from "./nodeAbstraction";

const inputNode = {
  ...createNode(
    "customInput",
    "Input",
    "Entry point for capturing user data like text, files, or audio.",
    "class",
    "fa-solid fa-arrow-right-to-bracket"
  ),
  handle: [handleCreate("source", "value", "right")],
  form: [
    generateInput('Name', 'inputHandle'),
    generateInput('Type', 'select', { options: ["Text", "File", "Audio"] }),
  ],
};

const llmNode = {
  ...createNode(
    "llm",
    "LLM",
    "Interacts with a language model to process queries and generate responses.",
    "image",
    "./ai.png"
  ),
  handle: [
    handleCreate("target", "system", "left"),
    handleCreate("target", "prompt", "left"),
    handleCreate("source", "response", "right")
  ],
  form: [
    generateInput('Query', 'textarea'),
    generateInput('Type', 'select', { options: ["Text", "File", "Audio"] }),
  ],
};

const outputNode = {
  ...createNode(
    "customOutput",
    "Output",
    "Outputs processed information like text, files, or audio.",
    "image",
    "./op.jpg"
  ),
  handle: [handleCreate("target", "value", "left")],
  form: [
    generateInput('Output', 'radio', { options: ["Text", "File", "Audio"] }),
  ]
};

const textNode = {
  ...createNode(
    "text",
    "Text",
    "Represents text data for input and manipulation.",
    "image",
    "./file.png"
  ),
  handle: [handleCreate("source", "output", "right")],
  form: [
    generateInput('Text', 'variableText'),
  ]
};

const userNode = {
  ...createNode(
    "user",
    "User",
    "Tracks user-specific data or actions like expenses.",
    "class",
    "fa fa-user"
  ),
  handle: [handleCreate("source", "Expense", "right")],
  form: [
    generateInput('Consume', 'variableText'),
  ]
};

const NetflixNode = {
  ...createNode(
    "Netflix",
    "Netflix",
    "Handles media selection and related financial aspects.",
    "image",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGZhYUrmk6vDmi1-Pj7oI-HzTpQDCi9-IFTA&s"
  ),
  handle: [
    handleCreate("source", "Media", "right"),
    handleCreate("target", "Money", "left")
  ],
  form: [
    generateInput('Media', 'select', { options: ["Series", "Movie"] }),
  ]
};

const GymNode = {
  ...createNode(
    "Gym",
    "Gym",
    "Tracks workout types and related financial aspects.",
    "class",
    "fa-solid fa-dumbbell"
  ),
  handle: [
    handleCreate("source", "Strength", 'right'),
    handleCreate("target", "Money", 'left')
  ],
  form: [
    generateInput('Workout', 'select', { options: ["Cardio", "Weight Lifting"] }),
  ]
};

export const nodes = [inputNode, llmNode, outputNode, textNode, userNode, NetflixNode, GymNode];
export const nodeTypeNames = nodes.map((node) => node.type);
