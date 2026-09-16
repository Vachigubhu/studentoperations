const AUTH_LOGOUT_EVENT = "studentops:logout";

export const emitLogoutEvent = () => {
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

export const onLogoutEvent = (callback: () => void) => {
  window.addEventListener(AUTH_LOGOUT_EVENT, callback);

  return () => {
    window.removeEventListener(AUTH_LOGOUT_EVENT, callback);
  };
};
