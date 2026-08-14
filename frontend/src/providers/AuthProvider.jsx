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
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLogin: user.lastLogin,
});

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { accessToken, user, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [isReady, setIsReady] = useState(false);

  // Prevent duplicate bootstrap requests.
  const bootstrapStartedRef = useRef(false);

  // Prevent unnecessary refresh calls.
  const lastRefreshAtRef = useRef(0);

  // Prevent simultaneous refresh operations.
  const refreshPromiseRef = useRef(null);

  /**
   * Restore the authentication session.
   *
   * Important:
   * - Access token comes from Redux memory.
   * - Refresh token comes automatically from HTTP-only cookie.
   * - Nothing is stored in localStorage/sessionStorage.
   */
  const synchronizeSession = useCallback(
    async ({ silent = false } = {}) => {
      // If Redux already has a valid session, don't call backend.
      if (isAuthenticated && accessToken && user) {
        if (!silent) {
          setIsReady(true);
        }

        return true;
      }

      // Prevent multiple refresh requests.
      if (refreshPromiseRef.current) {
        return refreshPromiseRef.current;
      }

      const refreshSession = async () => {
        try {
          dispatch(beginAuthBootstrap());

          const response = await refreshTokenService();

          const payload = response?.data ?? response;

          if (!payload?.success || !payload?.accessToken || !payload?.user) {
            throw new Error("Authentication session could not be restored.");
          }

          const normalizedUser = toSafeUser(payload.user);

          // Store access token ONLY in memory.
          setAxiosAuthToken(payload.accessToken);

          dispatch(
            loginSuccess({
              accessToken: payload.accessToken,
              user: normalizedUser,
            }),
          );

          lastRefreshAtRef.current = Date.now();

          return true;
        } catch (error) {
          // No valid refresh cookie/session.
          setAxiosAuthToken(null);

          dispatch(logout());

          return false;
        } finally {
          dispatch(completeAuthBootstrap());

          if (!silent) {
            setIsReady(true);
          }
        }
      };

      refreshPromiseRef.current = refreshSession();

      try {
        return await refreshPromiseRef.current;
      } finally {
        refreshPromiseRef.current = null;
      }
    },
    [accessToken, user, isAuthenticated, dispatch],
  );

  /**
   * Initial authentication bootstrap.
   *
   * This runs exactly once when the application starts.
   */
  useEffect(() => {
    if (bootstrapStartedRef.current) {
      return;
    }

    bootstrapStartedRef.current = true;

    const bootstrap = async () => {
      await synchronizeSession({ silent: false });
    };

    void bootstrap();
  }, [synchronizeSession]);

  /**
   * Multi-tab authentication synchronization.
   *
   * This does NOT store credentials.
   * It only informs other tabs that login/logout happened.
   */
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const unsubscribe = subscribeToAuthEvents({
      onLogout: () => {
        setAxiosAuthToken(null);
        dispatch(logout());
      },

      onLogin: (payload) => {
        if (!payload?.accessToken || !payload?.user) {
          return;
        }

        setAxiosAuthToken(payload.accessToken);

        dispatch(
          loginSuccess({
            accessToken: payload.accessToken,
            user: toSafeUser(payload.user),
          }),
        );
      },
    });

    return unsubscribe;
  }, [dispatch]);

  /**
   * Restore session when the browser/tab becomes active again.
   *
   * We DON'T refresh every time focus changes.
   * Only refresh if the application has been inactive for
   * more than 5 minutes.
   */
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const SESSION_REFRESH_INTERVAL = 5 * 60 * 1000;

    const checkSession = async () => {
      const now = Date.now();

      if (now - lastRefreshAtRef.current < SESSION_REFRESH_INTERVAL) {
        return;
      }

      // If we already have a valid Redux session,
      // don't unnecessarily call refresh.
      const state = window.__REDUX_STORE__?.getState?.();

      if (
        state?.auth?.isAuthenticated &&
        state?.auth?.accessToken &&
        state?.auth?.user
      ) {
        return;
      }

      await synchronizeSession({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkSession();
      }
    };

    const handleFocus = () => {
      void checkSession();
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("focus", handleFocus);
    };
  }, [synchronizeSession]);

  /**
   * Don't render the application until the initial
   * authentication check has completed.
   *
   * This prevents protected pages from briefly flashing
   * before the refresh-token check finishes.
   */
  if (!isReady) {
    return (
      <div style={FULL_PAGE_LOADING_STYLE}>
        <div
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
          }}
        >
          Checking your session…
        </div>

        <div
          style={{
            fontSize: "0.95rem",
            color: "#475569",
          }}
        >
          Restoring your secure access.
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
