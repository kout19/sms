import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken as refreshTokenService } from "../modules/auth/services/authService";
import { setAxiosAuthToken } from "../shared/api/axios";
import {
  loginSuccess,
  logout,
  beginAuthBootstrap,
  completeAuthBootstrap,
} from "../store/authSlice";
import {
  publishAuthEvent,
  subscribeToAuthEvents,
} from "../shared/utils/authSessionSync";

const FULL_PAGE_LOADING_STYLE = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "1rem",
  background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
  color: "#0f172a",
  fontFamily: "Inter, system-ui, sans-serif",
};

const toSafeUser = (user = {}) => ({
  id: user._id || user.id,
  firstName: user.firstName || "",
  lastName: user.lastName || "",
  email: user.email || "",
  role: user.role,
  isActive: user.isActive ?? true,
});

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const authRef = useRef(auth);
  const lastRefreshAtRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const bootstrapAttemptedRef = useRef(false);

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  const synchronizeSession = useCallback(
    async ({ silent = false } = {}) => {
      const { accessToken, user, isAuthenticated } = authRef.current;

      if (isAuthenticated && accessToken && user) {
        if (!silent) {
          setIsReady(true);
        }

        return true;
      }

      try {
        dispatch(beginAuthBootstrap());

        const response = await refreshTokenService();
        const payload = response?.data ?? response;

        if (!payload?.success || !payload?.accessToken || !payload?.user) {
          throw new Error("Authentication refresh failed.");
        }

        const normalizedUser = toSafeUser(payload.user);
        setAxiosAuthToken(payload.accessToken);
        dispatch(
          loginSuccess({
            accessToken: payload.accessToken,
            user: normalizedUser,
          }),
        );

        publishAuthEvent({
          type: "LOGIN_SYNC",
          accessToken: payload.accessToken,
          user: normalizedUser,
        });

        lastRefreshAtRef.current = Date.now();
        return true;
      } catch {
        dispatch(logout());
        publishAuthEvent({ type: "LOGOUT_SYNC" });
        return false;
      } finally {
        dispatch(completeAuthBootstrap());
        setIsReady(true);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (bootstrapAttemptedRef.current) {
      return undefined;
    }

    bootstrapAttemptedRef.current = true;

    void synchronizeSession({ silent: false });

    return undefined;
  }, [synchronizeSession]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const unsubscribe = subscribeToAuthEvents({
      onLogout: () => {
        dispatch(logout());
      },
      onLogin: (payload) => {
        dispatch(
          loginSuccess({
            accessToken: payload.accessToken,
            user: toSafeUser(payload.user),
          }),
        );
      },
    });

    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();

        if (now - lastRefreshAtRef.current > 60_000) {
          await synchronizeSession({ silent: true });
        }
      }
    };

    const handleFocus = async () => {
      const now = Date.now();

      if (now - lastRefreshAtRef.current > 60_000) {
        await synchronizeSession({ silent: true });
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, synchronizeSession]);

  if (!isReady) {
    return (
      <div style={FULL_PAGE_LOADING_STYLE}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
          Checking your session…
        </div>
        <div style={{ fontSize: "0.95rem", color: "#475569" }}>
          Restoring your secure access.
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
