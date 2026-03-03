import React from 'react';
import './StudentRoster.css';

// confidenceLevel may be stored as 1–3 (low/med/high) or 0–100
const normalizeConfidence = (level) => {
  if (level == null) return null;
  if (level <= 3) return Math.round((level / 3) * 100);
  return Math.round(level);
};

const DISPLAY_STATUSES = new Set(['Excelling', 'On Track', 'Improving', 'Needs Support']);

const deriveStatus = (student) => {
  if (DISPLAY_STATUSES.has(student.status)) return student.status;
  const avg = ((student.performanceX ?? 0) + (student.performanceY ?? student.performanceX ?? 0)) / 2;
  if (avg >= 90) return 'Excelling';
  if (avg >= 75) return 'On Track';
  if (avg >= 60) return 'Improving';
  return 'Needs Support';
};

const StudentRoster = ({ students: studentsProp }) => {
  const students = studentsProp || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excelling':
        return '#888';
      case 'On Track':
        return '#aaa';
      case 'Improving':
        return '#999';
      case 'Needs Support':
        return '#666';
      default:
        return '#777';
    }
  };

  return (
    <div className="student-roster">
      <div className="roster-header">
        <h3 className="roster-title">Student Roster</h3>
        <p className="roster-subtitle">Performance and confidence tracking for current class</p>
      </div>
      
      <div className="roster-table-container">
        <table className="roster-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Performance X</th>
              <th>Performance Y</th>
              <th>Confidence Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const confidence = normalizeConfidence(student.confidenceLevel);
              const displayStatus = deriveStatus(student);
              return (
                <tr key={student.id} className="student-row">
                  <td className="student-name">{student.name}</td>
                  <td className="performance-score">{student.performanceX != null ? `${Math.round(student.performanceX)}%` : '—'}</td>
                  <td className="performance-score">{student.performanceY != null ? `${Math.round(student.performanceY)}%` : '—'}</td>
                  <td className="confidence-score">{confidence != null ? `${confidence}%` : '—'}</td>
                  <td className="student-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(displayStatus) }}
                    >
                      {displayStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentRoster;
