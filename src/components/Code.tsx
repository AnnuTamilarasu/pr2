//Routing
import { useEffect, useState } from "react";

//Code Editor
import CodeMirror from "@uiw/react-codemirror";

//Editor Languages
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { css } from "@codemirror/lang-css";

//live server
import { socket } from "./Socket";

//error highlighting -- in progress
import { lintGutter } from "@codemirror/lint";

//css
import "bootstrap/dist/css/bootstrap.css";

function CodeEditor() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  // recieves code updates
  useEffect(() => {
    const handleCodeUpdate = (newCode: string) => {
      setCode(newCode);
    };

    socket.on("codeUpdate", handleCodeUpdate);
    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
    };
  }, []);

  // updates code to client
  const handleChange = (value: string) => {
    setCode(value);
    socket.emit("codeChange", value);
  };

  // language
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
  //Placeholder with comment syle for eachj language
  const getPlaceholder = () => {
    switch (language) {
      case "python":
        return "#Start coding here...";
      case "html":
        return "<!--Start coding here...-->";
      case "javascript":
      case "Java":
        return "//Start coding here...";
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Language selector */}
      <div style={{ marginBottom: "8px" }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            backgroundColor: "#1e1e1e",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #333",
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="java">JAVA</option>
        </select>
      </div>

      {/* Editor */}
      <div
        className="editor-container"
        style={{
          flex: 1,
          display: "flex",
          width: "100%",
          height: "100%",
          minHeight: "500px",
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <CodeMirror
          value={code}
          height="89vh"
          width="100%"
          theme="dark"
          extensions={[getLanguageExtension(), lintGutter()]}
          onChange={(value) => handleChange(value)}
          placeholder={getPlaceholder()}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
