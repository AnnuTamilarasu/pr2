import React, { useState } from "react";
export interface TabItem {
  id: number;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTabId, setActiveTabId] = useState<number>(tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTabId)?.content;

  return (
    <div className="tabs-container">
      {/* Tab Headers (Buttons) */}
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            // Dynamically add an "active" class for styling
            className={`tab-button ${activeTabId === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tabs-content">{activeTabContent}</div>
    </div>
  );
};

export default Tabs;
