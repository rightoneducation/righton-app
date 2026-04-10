import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const Header = ({ classrooms = [], selectedClassroomId, onClassChange, onUpload }) => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>RightOn MicroCoach</h1>

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
          <button className="header-upload-btn" onClick={onUpload}>
            <UploadIcon />
            Upload
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
