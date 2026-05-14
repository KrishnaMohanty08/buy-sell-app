const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// - login() — POST to /api/auth/login, stores token
// - register() — POST to /api/auth/register, stores token
// - logout() — Clears token from localStorage
// - getToken() — Retrieves stored token
// - isAuthenticated() — Checks if user is logged in
// - fetchWithAuth() — Helper to automatically attach token to requests

export const login =async(email,password)=>{
    try {
      const response =await fetch(`${API_BASE_URL}/api/auth/login`,{
        method :'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email,password}),
      });
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      // Store token in localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        return data;
    } catch (error) {
      console.error("Login failed:", error);
        throw error;
    }
}

export const requestOtp = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to request OTP');
        }
        return await response.json();
    } catch (error) {
        console.error('requestOtp failed:', error);
        throw error;
    }
}

export const verifyOtp = async (email, otp) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'OTP verification failed');
        }
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        return data;
    } catch (error) {
        console.error('verifyOtp failed:', error);
        throw error;
    }
}
export const register =async(firstName,lastName,email,password)=>{
    try {
      const response =await fetch(`${API_BASE_URL}/api/auth/register`,{
        method :'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({firstName,lastName,email,password}),
      });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        const data = await response.json();
        // Store token if provided after registration
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }

        return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }   
}

export const logout=()=>{
    localStorage.removeItem('authToken');
}

export const getToken=()=>{
    return localStorage.getItem('authToken');
}

export const isAuthenticated=()=>{
    return !!localStorage.getItem('authToken');
}

export const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers
    });
};

export const getCurrentUser = async () => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/auth/user`);
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get current user:", error);
        throw error;
    }
};