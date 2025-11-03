// src/components/FileTabs.tsx
import React from "react";
import CodeEditor from "./CodeEditor.tsx";
import type { ListItem } from "./types.ts";
import { socket } from "./Socket.ts";

interface FileTabsProps {
  files: ListItem[];
  activeTabId: number | null;
  setActiveTabId: (id: number) => void;
  onFileUpdate: (
    fileId: number,
    tabId: number,
    newCode: string,
    newLanguage?: string
  ) => void;
}

const FileTabs: React.FC<FileTabsProps> = ({
  files,
  activeTabId,
  setActiveTabId,
  onFileUpdate,
}) => {
  // Emit local changes
  const handleLocalChange = (
    fileId: number,
    tabId: number,
    newCode: string
  ) => {
    socket.emit("codeUpdate", { fileId, tabId, newCode });
    console.log("FileTabs - codeUpdate, local code change event sent");
  };

  return (
    <div>
      <ul className="nav nav-tabs">
        {files.map((file) => (
          <li className="nav-item" key={file.id}>
            <a
              href="#"
              className={`nav-link ${activeTabId === file.id ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTabId(file.id);
              }}
            >
              {file.text}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        {files.map(
          (file) =>
            activeTabId === file.id &&
            file.tabs.map((tab) => (
              <div key={tab.id}>
                <CodeEditor
                  code={tab.code}
                  language={tab.language}
                  onChange={(code) => handleLocalChange(file.id, tab.id, code)}
                  onLanguageChange={(newLang) =>
                    onFileUpdate(file.id, tab.id, tab.code, newLang)
                  }
                  fileId={file.id}
                  tabId={tab.id}
                />
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default FileTabs;
