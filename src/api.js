const API_BASE = "https://vault-backend-api-szxu.onrender.com";

/**
 * Centralized fetch wrapper with automatic silent refresh.
 * - Attaches Authorization header from localStorage.
 * - Sends credentials (httpOnly cookies) with every request.
 * - On 401, attempts to refresh the access token and retries once.
 * - If refresh fails, dispatches a 'session-expired' event for logout.
 */

let isRefreshing = false;
let refreshPromise = null;

async function refreshAccessToken() {
  const response = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    credentials: "include",  // sends the httpOnly refresh_token cookie
  });

  if (!response.ok) {
    throw new Error("Refresh failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access_token);
  return data.access_token;
}

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  // Attach auth header and credentials
  const token = localStorage.getItem("token");
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: "include",  // always send cookies
  };

  let response = await fetch(url, fetchOptions);

  // If 401, attempt a silent refresh and retry once
  if (response.status === 401) {
    try {
      // Prevent multiple simultaneous refresh calls
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      // Retry the original request with the new token
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url, { ...fetchOptions, headers });
    } catch (error) {
      isRefreshing = false;
      refreshPromise = null;

      // Refresh failed — session is truly expired
      window.dispatchEvent(new CustomEvent("session-expired"));
      throw error;
    }
  }

  return response;
}

export default apiFetch;
