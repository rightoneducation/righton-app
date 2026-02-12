import React from 'react';
import './NavigationTabs.css';

const NavigationTabs = ({ activeTab = "Overview", onTabChange }) => {
  const tabs = ["Overview", "Students", "Settings"];

  return (
    <nav className="navigation-tabs">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => onTabChange && onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;
