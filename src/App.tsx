import React, { useState } from "react";
import CodeEditor from "./components/Code";
import UploadFile from "./components/upload";

function App() {
  const [code, setCode] = useState<string>("");

  // ✅ Make sure setCode is actually called
  const handleFileLoad = (content: string) => {
    console.log("📄 File loaded:", content); // Debug log
    setCode(content);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <UploadFile onFileLoaded={handleFileLoad} />
      <CodeEditor initialCode={code} />
    </div>
  );
}

export default App;
