import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './UploadPage.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState('uncommon');
  const [classroom, setClassroom] = useState('');
  const [activityFile, setActivityFile] = useState(null);
  const [studentDataFile, setStudentDataFile] = useState(null);

  const activityInputRef = useRef(null);
  const studentDataInputRef = useRef(null);

  const handleUpload = (e) => {
    e.preventDefault();
    // Upload logic goes here
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="overview-content">
          <div className="overview-navigation">
            <nav className="overview-nav-tabs">
              <button className="overview-nav-tab active" type="button">
                Upload
              </button>
            </nav>
          </div>

          <div className="upload-card">
            <h2 className="upload-title">Upload Classroom Data</h2>
            <p className="upload-subtitle">
              Select your organization and classroom, then upload an activity file (.docx) and
              student data file (.xlsx) to analyze misconceptions and recommend Next Steps.
            </p>

            <form className="upload-form" onSubmit={handleUpload}>
              <div className="upload-fields">

                <div className="upload-field-group">
                  <label className="upload-label" htmlFor="organization">
                    Organization
                  </label>
                  <select
                    id="organization"
                    className="upload-select"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  >
                    <option value="uncommon">Uncommon Schools</option>
                  </select>
                </div>

                <div className="upload-field-group">
                  <label className="upload-label" htmlFor="classroom">
                    Classroom
                  </label>
                  <select
                    id="classroom"
                    className="upload-select"
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                  >
                    <option value="" disabled>Select a classroom</option>
                    <option value="classroom-1">Classroom 1</option>
                    <option value="classroom-2">Classroom 2</option>
                    <option value="classroom-3">Classroom 3</option>
                    <option value="classroom-4">Classroom 4</option>
                  </select>
                </div>

                <div className="upload-field-group">
                  <label className="upload-label" htmlFor="activity-file">
                    Activity File
                    <span className="upload-format-hint">.docx</span>
                  </label>
                  <div className="upload-file-row">
                    <input
                      id="activity-file"
                      className="upload-file-text"
                      type="text"
                      readOnly
                      placeholder="No file selected"
                      value={activityFile ? activityFile.name : ''}
                    />
                    <button
                      type="button"
                      className="upload-browse-btn"
                      onClick={() => activityInputRef.current?.click()}
                    >
                      Browse
                    </button>
                    <input
                      ref={activityInputRef}
                      type="file"
                      accept=".docx"
                      style={{ display: 'none' }}
                      onChange={(e) => setActivityFile(e.target.files[0] ?? null)}
                    />
                  </div>
                </div>

                <div className="upload-field-group">
                  <label className="upload-label" htmlFor="student-data-file">
                    Student Data
                    <span className="upload-format-hint">.xlsx</span>
                  </label>
                  <div className="upload-file-row">
                    <input
                      id="student-data-file"
                      className="upload-file-text"
                      type="text"
                      readOnly
                      placeholder="No file selected"
                      value={studentDataFile ? studentDataFile.name : ''}
                    />
                    <button
                      type="button"
                      className="upload-browse-btn"
                      onClick={() => studentDataInputRef.current?.click()}
                    >
                      Browse
                    </button>
                    <input
                      ref={studentDataInputRef}
                      type="file"
                      accept=".xlsx"
                      style={{ display: 'none' }}
                      onChange={(e) => setStudentDataFile(e.target.files[0] ?? null)}
                    />
                  </div>
                </div>

              </div>

              <div className="upload-actions">
                <button type="submit" className="yns-btn primary">
                  Upload
                </button>
                <button
                  type="button"
                  className="yns-btn secondary"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
