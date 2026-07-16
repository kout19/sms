import { useSelector, useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} from "../../../store/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    dispatch,
    loginStart: () => dispatch(loginStart()),
    loginSuccess: (payload) => dispatch(loginSuccess(payload)),
    loginFailure: (error) =>
      dispatch(loginFailure(typeof error === "string" ? error : error?.message)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
    updateUser: (payload) => dispatch(updateUser(payload)),
  };
};

export const getRoleDashboardPath = (role) => {
  const paths = {
    "super-admin": "/super-admin/dashboard",
    admin: "/admin/dashboard",
    teacher: "/teacher/dashboard",
    student: "/student/dashboard",
    parent: "/parent/dashboard",
  };

  return paths[role] || "/login";
};
