import { useSelector, useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} from "../../../store/authSlice";
import { setAxiosAuthToken } from "../../../shared/api/axios";
import { publishAuthEvent } from "../../../shared/utils/authSessionSync";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

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
    logout: () => {
      setAxiosAuthToken(null);
      dispatch(logout());
      publishAuthEvent({ type: "LOGOUT_SYNC" });
    },
    clearError: () => dispatch(clearError()),
    updateUser: (payload) => dispatch(updateUser(payload)),
  };
};

export const getRoleDashboardPath = (role) => {
  const paths = {
    "super-admin": "/super-admin",
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
    parent: "/parent",
  };

  return paths[role] || "/login";
};
