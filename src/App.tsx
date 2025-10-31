import CodeEditor from "./components/Code";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
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
          <Route path="/"></Route>
          <Route path="/Code" element={<CodeEditor />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
