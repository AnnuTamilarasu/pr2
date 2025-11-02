import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

import UploadFile from "./components/UploadFIle";
import CodeEditor from "./components/CodeEditor";
import DynamicList from "./components/FileTabs";

const App: React.FC = () => {
  const [code, setCode] = useState<string>("");

  return (
    <div className="container my-4 ">
      {/* Upload Section */}
      <section className="mb-4">
        <div className="card shadow-sm p-3 bg-dark text-white">
          <h5 className="mb-3">Upload a File</h5>
          <UploadFile onFileLoaded={(content) => setCode(content)} />
        </div>
      </section>

      {/* Files Navigation */}
      <section className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#"></a>
          </li>
        </ul>
      </section>
      <section>
        <DynamicList />
      </section>

      {/* Editor Section */}
      <section>
        <div className="card shadow-sm p-3 bg-dark text-white">
          <h5 className="mb-3">Code Editor</h5>
          <CodeEditor initialCode={code} />
        </div>
      </section>
    </div>
  );
};

export default App;
