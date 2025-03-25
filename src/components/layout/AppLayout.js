import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './AppLayout.css';

const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const closeMenu = () => {
        setMenuOpen(false);
    };
    
    const isActivePath = (path) => {
        return location.pathname.startsWith(path);
    };
    
    if (!user) {
        return children;
    }
    
    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="header-left">
                    <button 
                        className="menu-toggle" 
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h1 className="app-title">OpenAutomate</h1>
                </div>
                
                <div className="header-right">
                    <span className="user-info">
                        {user.username}
                    </span>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
            
            <div className="app-body">
                <aside className={`app-sidebar ${menuOpen ? 'open' : ''}`}>
                    <nav className="sidebar-nav">
                        <Link 
                            to="/dashboard" 
                            className={`nav-item ${isActivePath('/dashboard') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/robots" 
                            className={`nav-item ${isActivePath('/robots') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            Robots
                        </Link>
                    <Link 
                        to="/packages" 
                        className={`nav-item ${isActivePath('/packages') ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Bot Packages
                    </Link>
                        {/* Add more menu items here */}
                    </nav>
                </aside>
                
                <main className="app-content">
                    {children}
                </main>
            </div>
            
            {menuOpen && (
                <div className="sidebar-overlay" onClick={closeMenu}></div>
            )}
        </div>
    );
};

export default AppLayout; 