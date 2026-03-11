import React from 'react';
import './Header.css';

const Header = ({ classrooms = [], selectedClassroomId, onClassChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">RightOn MicroCoach</h1>

        <div className="header-right">
          <div className="class-selector">
            <select
              value={selectedClassroomId ?? ''}
              onChange={(e) => onClassChange && onClassChange(e.target.value)}
              className="class-dropdown"
            >
              <option value="" disabled style={{ fontStyle: 'italic' }}>Select pilot class</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.classroomName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
