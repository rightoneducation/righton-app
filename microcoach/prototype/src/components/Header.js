import React from 'react';
import './Header.css';

const Header = ({ dateRange = "Last 30 days", onDateRangeChange, onExportSummary, selectedClass = "Algebra I - Period 3", onClassChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Microcoach</h1>
        
        <div className="class-selector">
          <select 
            value={selectedClass} 
            onChange={(e) => onClassChange && onClassChange(e.target.value)}
            className="class-dropdown"
          >
            <option value="Algebra I - Period 3">Algebra I - Period 3</option>
            <option value="Algebra I - Period 5">Algebra I - Period 5</option>
            <option value="Geometry - Period 2">Geometry - Period 2</option>
            <option value="Pre-Calculus - Period 1">Pre-Calculus - Period 1</option>
            <option value="Statistics - Period 4">Statistics - Period 4</option>
          </select>
        </div>
        
        <div className="header-right">
          <div className="date-range-selector">
            <select 
              value={dateRange} 
              onChange={(e) => onDateRangeChange && onDateRangeChange(e.target.value)}
              className="date-dropdown"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
              <option value="This year">This year</option>
            </select>
          </div>
          
          <button 
            className="export-button"
            onClick={onExportSummary}
          >
            Export Summary
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
