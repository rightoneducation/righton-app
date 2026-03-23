import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIClient } from '@righton/microcoach-api';
import Header from './Header';
import './UploadPage.css';

const apiClient = new APIClient();

const UploadPage = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState('uncommon');
  const [classroom, setClassroom] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [activityFile, setActivityFile] = useState(null);
  const [studentDataFile, setStudentDataFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // New classroom form
  const [showNewClassroom, setShowNewClassroom] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newSubject, setNewSubject] = useState('Math');
  const [newState, setNewState] = useState('NJ');
  const [newSchoolYear, setNewSchoolYear] = useState('2025-2026');
  const [creatingClassroom, setCreatingClassroom] = useState(false);

  const activityInputRef = useRef(null);
  const studentDataInputRef = useRef(null);

  useEffect(() => {
    apiClient.listClassrooms().then((items) => {
      setClassrooms(items);
    }).catch((err) => {
      console.error('Failed to fetch classrooms:', err);
    });
  }, []);

  const handleCreateClassroom = async () => {
    if (!newName.trim() || !newGrade) return;

    setCreatingClassroom(true);
    try {
      const created = await apiClient.createClassroom({
        classroomName: newName.trim(),
        grade: parseInt(newGrade, 10),
        subject: newSubject,
        state: newState,
        schoolYear: newSchoolYear,
      });
      setClassrooms((prev) => [...prev, created]);
      setClassroom(created.id);
      setShowNewClassroom(false);
      setNewName('');
      setNewGrade('');
    } catch (err) {
      console.error('Failed to create classroom:', err);
      setStatusMessage(`Failed to create classroom: ${err.message}`);
    } finally {
      setCreatingClassroom(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        resolve(btoa(binary));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!classroom || !activityFile || !studentDataFile) {
      setStatusMessage('Please select a classroom and both files.');
      return;
    }

    setUploading(true);
    setStatusMessage('Uploading files...');

    try {
      const [activityFileBase64, studentDataFileBase64] = await Promise.all([
        fileToBase64(activityFile),
        fileToBase64(studentDataFile),
      ]);

      const result = await apiClient.teacherUpload({
        classroomId: classroom,
        activityFileBase64,
        studentDataFileBase64,
      });

      const message = typeof result === 'string' ? JSON.parse(result) : result;
      setStatusMessage(message || 'Upload submitted — you will receive an email when analysis is ready.');
    } catch (err) {
      console.error('Upload failed:', err);
      setStatusMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
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
                  <div className="upload-classroom-row">
                    <select
                      id="classroom"
                      className="upload-select"
                      value={classroom}
                      onChange={(e) => setClassroom(e.target.value)}
                    >
                      <option value="" disabled>Select a classroom</option>
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.classroomName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="upload-add-btn"
                      onClick={() => setShowNewClassroom(!showNewClassroom)}
                    >
                      {showNewClassroom ? 'Cancel' : '+ New'}
                    </button>
                  </div>

                  {showNewClassroom && (
                    <div className="upload-new-classroom">
                      <div className="upload-new-classroom-fields">
                        <input
                          className="upload-input"
                          type="text"
                          placeholder="Classroom name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                        <select
                          className="upload-input upload-input-sm"
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                        >
                          <option value="" disabled>Grade</option>
                          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        <select
                          className="upload-input upload-input-sm"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                        >
                          <option value="Math">Math</option>
                          <option value="ELA">ELA</option>
                          <option value="Science">Science</option>
                        </select>
                        <select
                          className="upload-input upload-input-sm"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                        >
                          <option value="NJ">NJ</option>
                          <option value="NY">NY</option>
                          <option value="MA">MA</option>
                          <option value="CT">CT</option>
                        </select>
                        <input
                          className="upload-input upload-input-sm"
                          type="text"
                          placeholder="School year"
                          value={newSchoolYear}
                          onChange={(e) => setNewSchoolYear(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="yns-btn primary upload-create-btn"
                        onClick={handleCreateClassroom}
                        disabled={creatingClassroom || !newName.trim() || !newGrade}
                      >
                        {creatingClassroom ? 'Creating...' : 'Create Classroom'}
                      </button>
                    </div>
                  )}
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
                      disabled={uploading}
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
                      disabled={uploading}
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

              {statusMessage && (
                <p className="upload-status">{statusMessage}</p>
              )}

              <div className="upload-actions">
                <button type="submit" className="yns-btn primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  className="yns-btn secondary"
                  onClick={() => navigate('/')}
                  disabled={uploading}
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
