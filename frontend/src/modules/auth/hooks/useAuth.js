import { useSelector, useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutRedux,
  clearError,
  updateUser,
} from "../../../store/authSlice";
import { setAxiosAuthToken } from "../../../shared/api/axios";
import { publishAuthEvent } from "../../../shared/utils/authSessionSync";
import api from "../../../shared/api/axios";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // clear the httpOnly cookie
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setAxiosAuthToken(null); // remove auth header
      dispatch(logoutRedux()); // clear Redux state
      publishAuthEvent({ type: "LOGOUT_SYNC" });
    }
  };

  return {
    ...auth,
    dispatch,
    loginStart: () => dispatch(loginStart()),
    loginSuccess: (payload) => {
      setAxiosAuthToken(payload?.accessToken);
      dispatch(loginSuccess(payload));
      publishAuthEvent({
        type: "LOGIN_SYNC",
        accessToken: payload?.accessToken,
        user: payload?.user,
      });
    },
    loginFailure: (error) =>
      dispatch(
        loginFailure(typeof error === "string" ? error : error?.message),
      ),
    logout,
    clearError: () => dispatch(clearError()),
    updateUser: (payload) => dispatch(updateUser(payload)),
  };
};



export const getRoleDashboardPath = (role) => {
  const paths = {
    "super_admin": "/super-admin",
    admin: "/admin",
    "department_head": "/department-head",
     accountant: "/accountant",
    teacher: "/teacher",
    student: "/student",
    parent: "/parent",
  };

  return paths[role] || "/login";
};
