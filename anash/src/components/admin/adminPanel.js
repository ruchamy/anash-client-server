import React, { useState } from "react";
import "./adminPanel.css";
import Messages from "./messages";
import UsersAdmin from "./usersAdmin";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "ניהול משתמשים", component: <UsersAdmin /> },
    { id: "messages", label: "מכתבים", component: <Messages /> },
    { id: "ads", label: "ניהול פרסומות", component: <div>תוכן ניהול פרסומות</div> },
  ];
  return (
    <div className="admin-panel">
      <h1>פאנל ניהול</h1>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.find((tab) => tab.id === activeTab)?.component}
    </div>
  );
};

export default AdminPanel;
