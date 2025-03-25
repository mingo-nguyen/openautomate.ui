// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import RobotList from './features/robots/RobotList';
import CreateRobot from './features/robots/CreateRobot';
import RobotDetail from './features/robots/RobotDetail';
import PackageList from './features/packages/PackageList';
import UploadPackage from './features/packages/UploadPackage';
import PackageDetail from './features/packages/PackageDetail';
import AppLayout from './components/layout/AppLayout';
import useAuth from './hooks/useAuth';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return <AppLayout>{children}</AppLayout>;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    {/* Robot management routes */}
                    <Route
                        path="/robots"
                        element={
                            <ProtectedRoute>
                                <RobotList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/robots/create"
                        element={
                            <ProtectedRoute>
                                <CreateRobot />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/robots/details/:id"
                        element={
                            <ProtectedRoute>
                                <RobotDetail />
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Bot Package management routes */}
                    <Route
                        path="/packages"
                        element={
                            <ProtectedRoute>
                                <PackageList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/packages/upload"
                        element={
                            <ProtectedRoute>
                                <UploadPackage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/packages/details/:id"
                        element={
                            <ProtectedRoute>
                                <PackageDetail />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <div className="dashboard-placeholder">
                                    <h1>Dashboard</h1>
                                    <p>Welcome to OpenAutomate Dashboard</p>
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;