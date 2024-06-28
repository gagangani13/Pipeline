import { DataObject } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";

const SlateEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialContent = useMemo(
    () => [
      { type: "paragraph", children: [{ text: "Initial text" }] },
      { type: "variable", children: [{ text: "Editable Variable" }] },
    ],
    []
  );

  const [content, setContent] = useState(initialContent);
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "text":
        return <span {...props.attributes}>{props.children}</span>;
      case "variable":
        return (
          <span {...props.attributes} className="variable">
            <span contentEditable="true">&nbsp;</span>
            {props.children}
          </span>
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);
  const renderLeaf = useCallback((props) => {
    return <span {...props.attributes}>{props.children}</span>;
  }, []);

  const handleContentConvert = () => {
    const selectedText = window.getSelection().toString().trim() || "variable";
    const variableNode = {
      type: "variable",
      children: [{ text: selectedText }],
    };
    Transforms.insertNodes(editor, variableNode);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault(); // Prevent default behavior of arrow keys

      const { selection } = editor;
      if (!selection) {
        return;
      }
      const [start] = Editor.positions(editor, selection, { edge: "focus" });

      // Determine next position based on arrow key direction
      const next =
        event.key === "ArrowRight"
          ? Editor.after(editor, start)
          : Editor.before(editor, start);

      if (next) {
        Transforms.select(editor, next);
      }
    }
  };

  return (
    <>
      <IconButton className="convert_icon">
        <DataObject onClick={handleContentConvert} />
      </IconButton>
      <Slate
        editor={editor}
        initialValue={content}
        onChange={(newValue) => {
          setContent(newValue);
        }}
      >
        <div>
          <Editable
            className="nodrag custom-textarea cursor-text"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
          />
        </div>
      </Slate>
    </>
  );
};

export default SlateEditor;
