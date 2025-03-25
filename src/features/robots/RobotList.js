import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import robotService from '../../services/robotService';
import './RobotList.css';

const RobotList = () => {
    const [robots, setRobots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRobots();
    }, []);

    const fetchRobots = async () => {
        try {
            setLoading(true);
            const data = await robotService.getAllRobots();
            console.log("Robot data:", data); // For debugging
            setRobots(data);
            setError(null);
        } catch (err) {
            setError('Failed to load robots. Please try again later.');
            console.error('Error fetching robots:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (robot) => {
        // Check both property naming conventions and handle boolean or string values
        const isConnected = 
            robot.IsConnected === true || 
            robot.isConnected === true || 
            robot.IsConnected === 'true' || 
            robot.isConnected === 'true';
        
        return isConnected ? 'status-badge status-connected' : 'status-badge status-disconnected';
    };

    const getStatusText = (robot) => {
        // Check both property naming conventions and handle boolean or string values
        const isConnected = 
            robot.IsConnected === true || 
            robot.isConnected === true || 
            robot.IsConnected === 'true' || 
            robot.isConnected === 'true';
        
        return isConnected ? 'Connected' : 'Disconnected';
    };

    if (loading) {
        return <div className="loading-spinner">Loading robots...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="robot-list-container">
            <div className="robot-list-header">
                <h1>Robots</h1>
                <Link to="/robots/create" className="create-robot-button">
                    Add Robot
                </Link>
            </div>
    
            {robots.length === 0 ? (
                <div className="no-robots-message">
                    <p>No robots found. Click "Add Robot" to create one.</p>
                </div>
            ) : (
                <div className="robot-grid">
                    {robots.map((robot) => (
                        <div key={robot.ID || robot.id} className="robot-card">
                            <div className="robot-card-header">
                                <h3>{robot.MachineName || robot.machineName}</h3>
                                <span className={getStatusClass(robot)}>
                                    {getStatusText(robot)}
                                </span>
                            </div>
                            <div className="robot-card-body">
                                <p><strong>Machine Key:</strong> {(robot.MachineKey || robot.machineKey || '').substring(0, 8)}...</p>
                                <p><strong>Last Seen:</strong> {new Date(robot.LastSeen || robot.lastSeen || Date.now()).toLocaleString()}</p>
                            </div>
                            <div className="robot-card-footer">
                                <Link to={`/robots/details/${robot.ID || robot.id}`} className="view-details-button">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RobotList; 