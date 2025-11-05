import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import UploadFile from "./components/UploadFile.tsx";
import FileTabs from "./components/FileTabs.tsx";
import { socket } from "./components/Socket.ts";
import type { ListItem } from "./components/types.ts";

const App: React.FC = () => {
  const [files, setFiles] = useState<ListItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

  // Called when a new file is created (upload or empty)
  const handleFileCreated = (newFile: ListItem) => {
    setFiles((prev) => [...prev, newFile]);
    setActiveTabId(newFile.id); // make new tab active
  };

  // Update code or language in App state
  const handleFileUpdate = (
    fileId: number,
    tabId: number,
    newCode: string,
    newLanguage?: string
  ) => {
    console.log("App - handleFileUpdate, rendering the received code");
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              tabs: file.tabs.map((tab) =>
                tab.id === tabId
                  ? {
                      ...tab,
                      code: newCode,
                      language: newLanguage ?? tab.language,
                    }
                  : tab
              ),
            }
          : file
      )
    );
  };

  // Listen to server events for real-time updates
  useEffect(() => {
    socket.on("initFiles", (existingFiles: ListItem[]) => {
      console.log("App - initFiles");
      setFiles(existingFiles);
      if (existingFiles.length > 0) setActiveTabId(existingFiles[0].id);
    });

    socket.on("fileCreated", (newFile: ListItem) => {
      console.log("App - fileCreated, received a file name");
      setFiles((prev) => [...prev, newFile]);
    });

    socket.on("codeUpdate", (newFile: ListItem) => {
      console.log("App - codeUpdate, received a file update");
      handleFileUpdate(newFile.id, newFile.id + 1, newFile.text);
    });

    socket.on(
      "languageUpdate",
      (fileId: number, tabId: number, newLang: string) => {
        const tab = files
          .find((f) => f.id === fileId)
          ?.tabs.find((t) => t.id === tabId);
        const code = tab?.code ?? "";
        handleFileUpdate(fileId, tabId, code, newLang);
      }
    );

    return () => {
      socket.off("initFiles");
      socket.off("fileCreated");
      socket.off("codeUpdate");
      socket.off("languageUpdate");
    };
  }, []);

  return (
    <div
      className="container-fluid bg-dark text-white"
      style={{ width: "100%" }}
    >
      <section className="mb-4">
        <div className="card shadow-sm p-3 bg-black text-white">
          <UploadFile onFileCreated={handleFileCreated} />
        </div>
      </section>

      <section style={{ height: "100%" }}>
        <div className="card shadow-sm p-3 bg-dark text-white">
          <FileTabs
            files={files}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
            onFileUpdate={handleFileUpdate}
          />
        </div>
      </section>
    </div>
  );
};

export default App;
