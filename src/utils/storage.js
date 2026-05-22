export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'cf_access_token',
  REFRESH_TOKEN: 'cf_refresh_token',
  USER: 'cf_user',
};

export function getItem(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, payload);
  } catch {
    /* quota exceeded 등 무시 */
  }
}

export function removeItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* 무시 */
  }
}

export function clearAuth() {
  removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  removeItem(STORAGE_KEYS.USER);
}
