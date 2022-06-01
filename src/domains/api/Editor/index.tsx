import { createReactEditorJS } from "react-editor-js";

import { EDITOR_JS_TOOLS } from "./config";

export function Editor() {
  const EditorJs = createReactEditorJS();
  return (
    <EditorJs
      tools={EDITOR_JS_TOOLS}
      data={{
        time: 1556098174501,
        blocks: [
          {
            type: "code",
            data: {
              text: "Editor.js",
              level: 2,
            },
          }
        ],
        version: "2.12.4",
      }}
    />
  );
}
