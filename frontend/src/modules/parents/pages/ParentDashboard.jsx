import React from "react";
import { useAuth } from "../../../shared/utils";

/**
 * ParentDashboard - Main parent dashboard page
 * Displays parent-specific information and child progress
 */
function ParentDashboard() {
  const { user } = useAuth();

  const children = [
    {
      id: "child_001",
      name: "Emma Brown",
      class: "Class 8-A",
      gpa: 3.9,
      attendance: 96,
    },
    {
      id: "child_002",
      name: "Noah Brown",
      class: "Class 10-B",
      gpa: 3.7,
      attendance: 92,
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}! 👨‍👩‍👧</h1>
        <p>Parent Dashboard</p>
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
            <strong>Phone:</strong> {user?.phone}
          </p>
          <p>
            <strong>Number of Children:</strong> {children.length}
          </p>
        </div>

        <div className="children-section">
          <h2>Children's Progress</h2>
          <div className="children-grid">
            {children.map((child) => (
              <div key={child.id} className="child-card">
                <h3>{child.name}</h3>
                <p className="class-info">{child.class}</p>
                <div className="child-stats">
                  <div className="stat">
                    <span className="label">GPA:</span>
                    <span className="value">{child.gpa}/4.0</span>
                  </div>
                  <div className="stat">
                    <span className="label">Attendance:</span>
                    <span className="value">{child.attendance}%</span>
                  </div>
                </div>
                <button className="view-btn">View Details</button>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">View Progress</button>
            <button className="action-btn">Messages</button>
            <button className="action-btn">Events</button>
            <button className="action-btn">Settings</button>
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

        .info-card, .children-section, .quick-actions {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          grid-column: span 1;
        }

        .children-section {
          grid-column: 1 / -1;
        }

        .info-card h2, .children-section h2, .quick-actions h2 {
          font-size: 1.3rem;
          color: #333;
          margin-top: 0;
        }

        .info-card p {
          margin: 8px 0;
          color: #555;
        }

        .children-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .child-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .child-card h3 {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
        }

        .class-info {
          margin: 0 0 15px 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .child-stats {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .stat .label {
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .stat .value {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .view-btn {
          width: 100%;
          padding: 8px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: rgba(255, 255, 255, 0.3);
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
          background: #6f42c1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .action-btn:hover {
          background: #5a32a3;
        }
      `}</style>
    </div>
  );
}

export default ParentDashboard;
