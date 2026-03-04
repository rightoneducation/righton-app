import React from 'react';
import './Header.css';

const Header = ({ selectedClass = "Class 1", onClassChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">RightOn MicroCoach</h1>

        <div className="header-right">
          <div className="class-selector">
            <select
              value={selectedClass}
              onChange={(e) => onClassChange && onClassChange(e.target.value)}
              className="class-dropdown"
            >
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
