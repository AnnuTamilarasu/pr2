import React, { useState } from "react";
import { socket } from "./Socket.ts";
import type { ListItem, TabItem } from "./types.ts";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface UploadFileProps {
  onFileCreated: (newFile: ListItem) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileCreated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  // Determine language based on extension
  const getLanguage = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return "javascript";
      case "py":
        return "python";
      case "html":
        return "html";
      case "css":
        return "css";
      case "java":
        return "java";
      default:
        return "javascript";
    }
  };

  // Upload real file
  const handleUpload = () => {
    if (!file) return alert("Select a file first!");
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("File onload " + file.name);
      const content = e.target?.result as string;
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const language = getLanguage(file.name);

      const newFile: ListItem = {
        id: Date.now(),
        text: fileName,
        tabs: [
          {
            id: Date.now() + 1,
            label: fileName,
            code: content,
            language,
          } as TabItem,
        ],
      };

      onFileCreated(newFile); // Send file to App state
      socket.emit("createFile", newFile);
      console.log("FileTabs - File opened, sending createFile event");
      setFile(null);
      setUploading(false);
    };

    reader.readAsText(file);
  };

  // Create empty file
  const handleCreateEmpty = () => {
    console.log("handleCreateEmpty ");
    const name = newFileName.trim();
    if (!name) return alert("Enter a file name!");

    const newFile: ListItem = {
      id: Date.now(),
      text: name,
      tabs: [
        {
          id: Date.now() + 1,
          label: name,
          code: "",
          language: "javascript",
        } as TabItem,
      ],
    };

    onFileCreated(newFile);
    socket.emit("createFile", newFile);
    console.log("FileTabs - New File created, sending createFile event");
    setNewFileName("");
  };

  return (
    <>
      <p className="d-inline-flex gap-1 bg-black">
        <a
          className="btn btn-success"
          data-bs-toggle="collapse"
          href="#collapseUpload"
          role="button"
          aria-expanded="false"
          aria-controls="collapseUpload"
        >
          Upload File
        </a>
        <button
          className="btn btn-success"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseNewFile"
          aria-expanded="false"
          aria-controls="collapseNewFile"
        >
          New File
        </button>
      </p>

      {/* Upload Section */}
      <div className="collapse" id="collapseUpload">
        <div className="card card-body bg-dark border-white">
          <input
            type="file"
            className="form-control me-2 bg-dark border-white text-white"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            accept=".txt,.js,.ts,.jsx,.tsx,.py,.html,.css,.java"
          />
          <button
            className="btn btn-success mt-2"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Open"}
          </button>
        </div>
      </div>

      {/* Create Empty File Section */}
      <div className="collapse mt-2" id="collapseNewFile">
        <div className="card card-body bg-dark border-white">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <input
              type="text"
              className="form-control me-2 border-white text-black"
              style={{ width: "65%" }}
              placeholder="New file name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <button
              className="btn btn-success"
              style={{ width: "32%" }}
              onClick={handleCreateEmpty}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFile;
