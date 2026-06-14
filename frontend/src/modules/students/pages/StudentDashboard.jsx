import React from "react";
import { useAuth } from "../../../shared/utils";

/**
 * StudentDashboard - Main student dashboard page
 * Displays student-specific information and academic progress
 */
function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}! 👨‍🎓</h1>
        <p>Student Dashboard</p>
      </div>

      <div className="dashboard-content">
        <div className="info-card">
          <h2>Your Profile</h2>
          <p>
            <strong>Name:</strong> {user?.firstName} {user?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Student ID:</strong> {user?.id}
          </p>
          <p>
            <strong>Class:</strong> {user?.class || "Class 10-A"}
          </p>
          <p>
            <strong>Roll Number:</strong> {user?.rollNumber || "42"}
          </p>
        </div>

        <div className="quick-actions">
          <h2>My Learning</h2>
          <div className="action-buttons">
            <button className="action-btn">View Grades</button>
            <button className="action-btn">Attendance</button>
            <button className="action-btn">Schedule</button>
            <button className="action-btn">Assignments</button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Academic Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">Overall GPA:</span>
              <span className="value">3.8/4.0</span>
            </div>
            <div className="status-item">
              <span className="label">Attendance:</span>
              <span className="value">94%</span>
            </div>
            <div className="status-item">
              <span className="label">Pending Work:</span>
              <span className="value">2 Assignments</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          color: #333;
          margin: 0;
        }

        .dashboard-header p {
          color: #666;
          margin: 5px 0 0 0;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .info-card, .quick-actions, .recent-activity {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .info-card h2, .quick-actions h2, .recent-activity h2 {
          font-size: 1.3rem;
          color: #333;
          margin-top: 0;
        }

        .info-card p {
          margin: 8px 0;
          color: #555;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .action-btn {
          flex: 1;
          min-width: 120px;
          padding: 10px 15px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .action-btn:hover {
          background: #218838;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .status-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .status-item .label {
          font-size: 0.85rem;
          color: #666;
        }

        .status-item .value {
          font-size: 1.3rem;
          font-weight: bold;
          color: #28a745;
        }
      `}</style>
    </div>
  );
}

export default StudentDashboard;
