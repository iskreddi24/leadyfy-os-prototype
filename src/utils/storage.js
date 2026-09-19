/**
 * Storage utility service for Leadyfy OS
 * Handles localStorage reading, writing, updating, and event dispatching.
 */

const STORAGE_PREFIX = 'leadyfy_os_v3_';

export function getStorageKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

export function getData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(getStorageKey(key));
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return fallback;
  }
}

export function setData(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(getStorageKey(key), serialized);
    // Dispatch custom storage update event so any mounted hook/listener can sync
    window.dispatchEvent(
      new CustomEvent('leadyfy_storage_update', {
        detail: { key, value }
      })
    );
    return true;
  } catch (error) {
    console.error(`Error setting key "${key}" in localStorage:`, error);
    return false;
  }
}

export function removeData(key) {
  try {
    localStorage.removeItem(getStorageKey(key));
    window.dispatchEvent(
      new CustomEvent('leadyfy_storage_update', {
        detail: { key, value: null }
      })
    );
    return true;
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
    return false;
  }
}

export function updateData(key, updater, fallback = []) {
  const current = getData(key, fallback);
  const updated = typeof updater === 'function' ? updater(current) : updater;
  setData(key, updated);
  return updated;
}

export function clearAllData() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent('leadyfy_storage_cleared'));
    return true;
  } catch (error) {
    console.error('Error clearing Leadyfy storage:', error);
    return false;
  }
}
