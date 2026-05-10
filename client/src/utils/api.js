const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        }
    });
    if (!res.ok) {
        throw new Error("Request failed");
    }
    return res.json();
};