import React, { useState } from "react";
import axios from "axios";

interface UploadFileProps {
  onFileLoaded: (content: string) => void; // Pass file content to parent
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileLoaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("picture", file);

      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("📄 Server response:", res.data.content); // Debug log
      onFileLoaded(res.data.content); // ✅ Pass content to App
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-3 d-flex gap-3">
      <input
        type="file"
        className="form-control w-auto"
        onChange={handleFileChange}
        accept=".txt,.js,.ts,.jsx,.tsx,.json,.py,.java,.html,.css"
      />
      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default UploadFile;
