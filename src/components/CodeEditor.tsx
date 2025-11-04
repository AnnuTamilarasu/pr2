import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { css } from "@codemirror/lang-css";
import { socket } from "./Socket.ts";
import type { ListItem, TabItem } from "./types.ts";

export interface CodeEditorProps {
  fileId: number; // ID of the file
  tabId: number; // ID of the tab
  code: string;
  language: string;
  onChange: (value: string) => void;
  onLanguageChange: (lang: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  fileId,
  tabId,
  code,
  language,
  onChange,
  onLanguageChange,
}) => {
  // Receive code updates from server
  useEffect(() => {
    const handleCodeUpdate = ({
      fileId: incomingFileId,
      tabId: incomingTabId,
      newCode,
    }: {
      fileId: number;
      tabId: number;
      newCode: string;
    }) => {
      if (incomingFileId === fileId && incomingTabId === tabId) {
        onChange(newCode);
      }
    };

    socket.on("codeUpdate", handleCodeUpdate);
    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
    };
  }, [fileId, tabId, onChange]);

  // Emit local changes
  const handleLocalChange = (value: string) => {
    onChange(value);
    //New code Tamil
    const updatedFile: ListItem = {
      id: fileId,
      text: value,
      tabs: [
        {
          id: fileId + 1,
          label: "",
          code: value,
          language,
        } as TabItem,
      ],
    };
    socket.emit("codeUpdate", updatedFile);
    console.log("codeUpdate, local code change event sent");
  };

  const getLanguageExtension = () => {
    switch (language) {
      case "python":
        return python();
      case "html":
        return html();
      case "java":
        return java();
      case "css":
        return css();
      default:
        return javascript();
    }
  };

  const getPlaceholder = () => {
    switch (language) {
      case "python":
        return "# Start coding here...";
      case "html":
        return "<!-- Start coding here... -->";
      default:
        return "// Start coding here...";
    }
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-center">
        <select
          className="form-select w-auto"
          value={language}
          onChange={(e) => {
            onLanguageChange(e.target.value);
            socket.emit("languageUpdate", {
              fileId,
              tabId,
              newLang: e.target.value,
            });
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="border rounded p-2 shadow-sm bg-dark">
        <CodeMirror
          value={code}
          height="400px"
          theme="dark"
          extensions={[getLanguageExtension()]}
          onChange={(value) => handleLocalChange(value)}
          placeholder={getPlaceholder()}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
