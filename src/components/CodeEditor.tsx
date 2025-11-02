import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { css } from "@codemirror/lang-css";
import { socket } from "./Socket";

interface CodeEditorProps {
  initialCode?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || "");
  const [language, setLanguage] = useState<string>("javascript");

  useEffect(() => {
    if (initialCode !== undefined) setCode(initialCode);
  }, [initialCode]);

  // Receive code updates from server
  useEffect(() => {
    const handleCodeUpdate = (newCode: string) => setCode(newCode);
    socket.on("codeUpdate", handleCodeUpdate);

    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
    };
  }, []);

  const handleChange = (value: string) => {
    setCode(value);
    socket.emit("codeChange", value);
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
          onChange={(e) => setLanguage(e.target.value)}
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
          onChange={handleChange}
          placeholder={getPlaceholder()}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
