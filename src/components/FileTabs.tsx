import React, { useState } from "react";
import CodeEditor from "./CodeEditor";

export interface TabItem {
  id: number;
  label: string;
  content: React.ReactNode;
}

interface ListItem {
  id: number;
  text: string;
  tabs: TabItem[];
}

const FileTabs: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItemText, setNewItemText] = useState<string>("");
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

  const handleAddItem = () => {
    if (newItemText.trim() !== "") {
      const newItem: ListItem = {
        id: Date.now(),
        text: newItemText.trim(),
        tabs: [
          {
            id: Date.now() + 1,
            label: newItemText.trim(),
            content: <CodeEditor initialCode={`// ${newItemText} code`} />,
          },
        ],
      };
      setItems((prev) => [...prev, newItem]);
      setActiveTabId(newItem.id); // Make new tab active
      setNewItemText("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemText(e.target.value);
  };

  return (
    <div>
      <h1>Files</h1>
      <input
        type="text"
        value={newItemText}
        onChange={handleChange}
        placeholder="Enter new item"
      />
      <button onClick={handleAddItem}>Add Item</button>

      <ul className="nav nav-tabs mt-3">
        {items.map((item) => (
          <li className="nav-item" key={item.id}>
            <a
              href="#"
              className={`nav-link ${activeTabId === item.id ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTabId(item.id);
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        {items.map(
          (item) =>
            activeTabId === item.id &&
            item.tabs.map((tab) => <div key={tab.id}>{tab.content}</div>)
        )}
      </div>
    </div>
  );
};

export default FileTabs;
