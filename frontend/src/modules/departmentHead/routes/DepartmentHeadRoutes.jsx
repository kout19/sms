import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../../../shared/utils";
import DepartmentHeadLayout from "../layouts/DepartmentHeadLayout";
import DepartmentHeadDashboard from "../pages/DepartmentHeadDashboard";
import RolePlaceholderPage from "../../../shared/components/RolePlaceholderPage";

const DepartmentHeadRoutes = () => {
  return (
    <ProtectedRoute
      allowedRoles={["department_head"]}
      element={
        <Routes>
          <Route path="/" element={<DepartmentHeadLayout />}>
            <Route index element={<DepartmentHeadDashboard />} />
            <Route path="dashboard" element={<DepartmentHeadDashboard />} />
            <Route
              path="department"
              element={
                <RolePlaceholderPage
                  title="Department"
                  description="Department profile and structure will be managed here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="teachers"
              element={
                <RolePlaceholderPage
                  title="Teachers"
                  description="Teacher assignments and departmental staffing views will be added here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="students"
              element={
                <RolePlaceholderPage
                  title="Students"
                  description="Department-level student oversight and progress summaries will be managed here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="courses"
              element={
                <RolePlaceholderPage
                  title="Courses"
                  description="Academic planning and course coordination will be handled here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="classes"
              element={
                <RolePlaceholderPage
                  title="Classes"
                  description="Class-level coordination and reporting will be added here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="assignments"
              element={
                <RolePlaceholderPage
                  title="Assignments"
                  description="Assignment oversight and planning workflows will be available here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="attendance"
              element={
                <RolePlaceholderPage
                  title="Attendance"
                  description="Attendance monitoring and departmental summaries will appear here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="exams"
              element={
                <RolePlaceholderPage
                  title="Exams"
                  description="Exam coordination and result oversight will be managed here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
            <Route
              path="reports"
              element={
                <RolePlaceholderPage
                  title="Reports"
                  description="Departmental analytics and performance reports will be centralized here."
                  backPath="/department-head/dashboard"
                  backLabel="Back to department dashboard"
                />
              }
            />
          </Route>
        </Routes>
      }
    />
  );
};

export default DepartmentHeadRoutes;
