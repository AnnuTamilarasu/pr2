export interface TabItem {
  id: number;
  label: string;
  code: string;
  language: string;
}

export interface ListItem {
  id: number;
  text: string;
  tabs: TabItem[];
}

export interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (newCode: string) => void;
  onLanguageChange: (newLanguage: string) => void;
  fileId: number;
  tabId: number;
}

// Server-to-client events for Socket.IO
export interface ServerToClientEvents {
  codeUpdate: (fileId: number, tabId: number, newCode: string) => void;
  languageUpdate: (fileId: number, tabId: number, newLanguage: string) => void;
  fileCreated: (newFile: ListItem) => void;
}

// Client-to-server events for Socket.IO
export interface ClientToServerEvents {
  codeChange: (fileId: number, tabId: number, newCode: string) => void;
  languageChange: (fileId: number, tabId: number, newLanguage: string) => void;
  createFile: (newFile: ListItem) => void;
}
