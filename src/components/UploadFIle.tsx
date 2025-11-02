import React, { useState } from "react";
import axios from "axios";

interface UploadFileProps {
  onFileLoaded: (content: string) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileLoaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("picture", file);

      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onFileLoaded(res.data.content);
      setFile(null); // Reset input
    } catch (err) {
      console.error("Upload error:", err);
      alert("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="d-flex gap-2 flex-wrap ">
      <input
        type="file"
        className="form-control w-auto"
        onChange={handleFileChange}
        accept=".txt,.js,.ts,.jsx,.tsx,.json,.py,.java,.html,.css"
      />
      <button
        className="btn btn-outline-dark"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default UploadFile;
