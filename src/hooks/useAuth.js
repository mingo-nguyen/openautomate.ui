import { useState, useEffect } from 'react';
import authService from '../services/authService';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);
            setError(null);
            const userData = await authService.login(username, password);
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return {
        user,
        loading,
        error,
        login,
        logout
    };
};

export default useAuth; 