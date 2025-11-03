import React, { useState } from "react";
import { socket } from "./Socket.ts";
import type { ListItem, TabItem } from "./types.ts";

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
      console.log("File created, sending upload request");
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
    console.log("File created, notifying");
    setNewFileName("");
  };

  return (
    <div className="d-flex flex-wrap gap-2 align-items-center">
      {/* File Upload */}
      <input
        type="file"
        className="form-control w-auto"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        accept=".txt,.js,.ts,.jsx,.tsx,.py,.html,.css,.java"
      />
      <button
        className="btn btn-outline-dark"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      {/* Empty File Creation */}
      <input
        type="text"
        className="form-control w-auto"
        placeholder="New file name"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
      />
      <button className="btn btn-outline-success" onClick={handleCreateEmpty}>
        New File
      </button>
    </div>
  );
};

export default UploadFile;
