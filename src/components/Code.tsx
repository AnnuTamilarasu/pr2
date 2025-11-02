import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";

// Editor Languages
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { css } from "@codemirror/lang-css";

// Live server
import { socket } from "./Socket";

// Error highlighting -- in progress
import { lintGutter } from "@codemirror/lint";

// CSS
import "bootstrap/dist/css/bootstrap.css";

// Props interface for initial code
interface CodeEditorProps {
  initialCode?: string; // Allows passing code from parent (App.tsx)
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode }) => {
  // State for code and language selection
  const [code, setCode] = useState<string>(
    initialCode || "// Start coding here..."
  );
  const [language, setLanguage] = useState<string>("javascript");

  // Update editor code when initialCode prop changes (e.g., after file upload)
  useEffect(() => {
    if (initialCode !== undefined) {
      setCode(initialCode);
    }
  }, [initialCode]); // ✅ watch for changes

  // recieves code updates from server
  useEffect(() => {
    const handleCodeUpdate = (newCode: string) => {
      setCode(newCode);
    };

    socket.on("codeUpdate", handleCodeUpdate);
    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
    };
  }, []);

  // updates code to client and broadcasts via socket
  const handleChange = (value: string) => {
    setCode(value);
    socket.emit("codeChange", value);
  };

  // Get language extension for CodeMirror
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

  // Placeholder with comment style for each language
  const getPlaceholder = () => {
    switch (language) {
      case "python":
        return "# Start coding here...";
      case "html":
        return "<!-- Start coding here... -->";
      case "javascript":
      case "java":
      case "css":
      default:
        return "// Start coding here...";
    }
  };

  return (
    <div className="container my-4">
      {/* Language selector */}
      <div className="mb-3 d-flex justify-content-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="form-select w-auto"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Code Editor */}
      <div
        className="border rounded p-2 shadow-sm bg-dark"
        style={{ minHeight: "500px" }}
      >
        <CodeMirror
          value={code} // current code state
          height="400px"
          theme="dark"
          extensions={[getLanguageExtension(), lintGutter()]} // language + linting
          onChange={handleChange} // update code state + emit to server
          placeholder={getPlaceholder()} // language-specific placeholder
        />
      </div>
    </div>
  );
};

export default CodeEditor;
