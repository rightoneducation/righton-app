import React from 'react';
import './StudentRoster.css';

const StudentRoster = () => {
  const students = [
    {
      id: 1,
      name: "Alex K.",
      performanceX: 78,
      performanceY: 82,
      confidenceLevel: 85,
      status: "On Track"
    },
    {
      id: 2,
      name: "Sarah M.",
      performanceX: 92,
      performanceY: 88,
      confidenceLevel: 90,
      status: "Excelling"
    },
    {
      id: 3,
      name: "Jamie L.",
      performanceX: 65,
      performanceY: 58,
      confidenceLevel: 45,
      status: "Needs Support"
    },
    {
      id: 4,
      name: "Chris B.",
      performanceX: 71,
      performanceY: 84,
      confidenceLevel: 62,
      status: "Improving"
    },
    {
      id: 5,
      name: "Taylor M.",
      performanceX: 95,
      performanceY: 93,
      confidenceLevel: 88,
      status: "Excelling"
    },
    {
      id: 6,
      name: "Jordan P.",
      performanceX: 83,
      performanceY: 79,
      confidenceLevel: 75,
      status: "On Track"
    },
    {
      id: 7,
      name: "Sam R.",
      performanceX: 69,
      performanceY: 72,
      confidenceLevel: 68,
      status: "On Track"
    },
    {
      id: 8,
      name: "Casey L.",
      performanceX: 58,
      performanceY: 61,
      confidenceLevel: 52,
      status: "Needs Support"
    },
    {
      id: 9,
      name: "Morgan T.",
      performanceX: 87,
      performanceY: 85,
      confidenceLevel: 82,
      status: "On Track"
    },
    {
      id: 10,
      name: "Riley H.",
      performanceX: 76,
      performanceY: 80,
      confidenceLevel: 78,
      status: "On Track"
    }
  ];

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
            {students.map((student) => (
              <tr key={student.id} className="student-row">
                <td className="student-name">{student.name}</td>
                <td className="performance-score">{student.performanceX}%</td>
                <td className="performance-score">{student.performanceY}%</td>
                <td className="confidence-score">{student.confidenceLevel}%</td>
                <td className="student-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(student.status) }}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentRoster;
