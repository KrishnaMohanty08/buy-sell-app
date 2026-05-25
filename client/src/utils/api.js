import api from "../api/http.js";

/**
 * Legacy wrapper for API requests
 * @deprecated Use api from "../api/http.js" directly instead
 * Kept for backwards compatibility
 */
export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    method: options.method || 'GET',
  };

  if (options.body) {
    config.data = typeof options.body === 'string' 
      ? JSON.parse(options.body) 
      : options.body;
  }

  const response = await api({
    url: endpoint,
    ...config,
  });

  return response.data;
};