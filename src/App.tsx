import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CodeEditor from "./components/Code";
import UploadFile from "./components/upload";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Home
          </Link>
          <Link className="navbar-brand" to="/Code">
            Code
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<UploadFile />} />
        <Route path="/Code" element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
