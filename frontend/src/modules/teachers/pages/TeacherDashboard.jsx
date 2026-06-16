import React from "react";
import { useAuth } from "../../../shared/utils";

const getInitials = (firstName, lastName) => {
  let name=`${firstName} ${lastName}`;
  if (!name) return "";

  // List of titles to ignore
  const titles = ["dr.", "mr.", "mrs.", "ms.", "prof.", "doc."];

  const cleanWords = name
    .trim()
    .split(/\s+/)
    .filter((word) => !titles.includes(word.toLowerCase())); // Removes titles

  // Takes the first letter of the first and last remaining words
  const firstInitial = cleanWords[0]?.[0] || "";
  const lastInitial =
    cleanWords.length > 1 ? cleanWords[cleanWords.length - 1][0] : "";

  return (firstInitial + lastInitial).toUpperCase();
};
function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container p-6 w-full ">
      <div className="flex items-center gap-2 ">
        <div className="flex items-center justify-center h-12 w-12 bg-indigo-500 text-white font-medium text-lg rounded-full ">
          {getInitials(user?.firstName, user?.lastName)}
        </div>

      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}! 👨‍🏫</h1>
        <p>Teacher Dashboard</p>
      </div>
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
    </div>
  );
}

export default TeacherDashboard;
