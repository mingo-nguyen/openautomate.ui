import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by useAuth hook
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>OpenAutomate</h1>
                    <p>Welcome back! Please login to your account.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={formErrors.username}
                        required
                    />
                    
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={formErrors.password}
                        required
                    />

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={loading}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login; 