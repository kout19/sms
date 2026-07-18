const AUTH_CHANNEL_NAME = "sms-auth-sync";
const AUTH_STORAGE_KEY = "sms-auth-sync-event";
const TAB_ID_KEY = "sms-auth-tab-id";

const isBrowser = typeof window !== "undefined";

const getTabId = () => {
  if (!isBrowser) {
    return "server";
  }

  if (!window.sessionStorage.getItem(TAB_ID_KEY)) {
    const nextId =
      window.crypto?.randomUUID?.() ||
      `tab-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.sessionStorage.setItem(TAB_ID_KEY, nextId);
  }

  return window.sessionStorage.getItem(TAB_ID_KEY);
};

const serializePayload = (payload) => {
  if (!isBrowser) {
    return;
  }

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

export const publishAuthEvent = (payload) => {
  if (!isBrowser) {
    return;
  }

  const event = {
    ...payload,
    timestamp: Date.now(),
    sourceId: getTabId(),
  };

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    channel.postMessage(event);
    channel.close();
  }

  serializePayload(event);
};

export const subscribeToAuthEvents = ({ onLogout, onLogin }) => {
  if (!isBrowser) {
    return () => {};
  }

  let channel = null;

  const currentTabId = getTabId();

  const handleIncomingMessage = (event) => {
    const payload = event?.data;

    if (!payload?.type || payload.sourceId === currentTabId) {
      return;
    }

    if (payload.type === "LOGOUT_SYNC") {
      onLogout?.();
      return;
    }

    if (payload.type === "LOGIN_SYNC") {
      onLogin?.({
        accessToken: payload.accessToken,
        user: payload.user,
      });
    }
  };

  const handleStorage = (event) => {
    if (event.key !== AUTH_STORAGE_KEY || !event.newValue) {
      return;
    }

    try {
      const payload = JSON.parse(event.newValue);
      handleIncomingMessage({ data: payload });
    } catch (error) {
      console.warn("Unable to parse auth sync payload.", error);
    }
  };

  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    channel.onmessage = handleIncomingMessage;
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.close();
    window.removeEventListener("storage", handleStorage);
  };
};

export { AUTH_CHANNEL_NAME, AUTH_STORAGE_KEY };
