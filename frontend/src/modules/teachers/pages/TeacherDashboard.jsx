import React from "react";
import { useAuth } from "../../../shared/utils";

/**
 * TeacherDashboard - Main teacher dashboard page
 * Displays teacher-specific information and quick actions
 */
function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}! 👨‍🏫</h1>
        <p>Teacher Dashboard</p>
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
            <strong>Department:</strong> {user?.department}
          </p>
          <p>
            <strong>Classes Assigned:</strong>{" "}
            {user?.classesAssigned?.join(", ") || "None"}
          </p>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Manage Classes</button>
            <button className="action-btn">Enter Grades</button>
            <button className="action-btn">View Attendance</button>
            <button className="action-btn">Messages</button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <p>No recent activity to display.</p>
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
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }

        .action-btn:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default TeacherDashboard;
