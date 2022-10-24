import { useState, useEffect } from "react";
import { EditorState, convertFromRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import parse from "html-react-parser";

const RichTextReadOnly = ({ text }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (text) {
      const DBEditorState = convertFromRaw(JSON.parse(text));
      setEditorState(EditorState.createWithContent(DBEditorState));
    }
  }, [text]);

  return <>{parse(convertToHTML(editorState.getCurrentContent()))}</>;
};

export default RichTextReadOnly;
