import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://27.66.25.144:8081/api';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                Username: username,
                Password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error.response?.data || { message: 'An error occurred during login' };
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default authService; 