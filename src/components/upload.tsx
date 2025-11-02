import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

interface FormValues {
  picture: FileList;
}

const UploadFile: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const onSubmit = (data: FormValues) => {
    if (data.picture && data.picture.length > 0) {
      const selectedFile = data.picture[0];
      setFile(selectedFile);
      setUploadStatus(`Selected file: ${selectedFile.name}`);
      console.log("Selected file:", selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first!");
      return;
    }

    const fd = new FormData();
    fd.append("picture", file); // ✅ matches backend

    try {
      const response = await axios.post("http://localhost:4000/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("File uploaded:", response.data);
      setUploadStatus(`✅ File uploaded! Content:\n${response.data.content}`);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("❌ Upload failed. Check console.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <h1>📁 Upload a File</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" {...register("picture")} />
        <button type="submit">Select File</button>
      </form>

      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        Upload
      </button>

      {uploadStatus && (
        <pre
          style={{
            marginTop: "10px",
            color: "lightgreen",
            whiteSpace: "pre-wrap",
            textAlign: "center",
          }}
        >
          {uploadStatus}
        </pre>
      )}
    </div>
  );
};

export default UploadFile;
