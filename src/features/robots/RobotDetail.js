import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import robotService from '../../services/robotService';
import './RobotDetail.css';

const RobotDetail = () => {
    const { id } = useParams();
    const [robot, setRobot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRobotDetails();
    }, [id]);

    const fetchRobotDetails = async () => {
        try {
            setLoading(true);
            const data = await robotService.getRobotById(id);
            console.log("Robot detail data:", data); // For debugging
            setRobot(data);
            setError(null);
        } catch (err) {
            setError('Failed to load robot details. Please try again later.');
            console.error('Error fetching robot details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (isConnected) => {
        return isConnected ? 'status-badge status-connected' : 'status-badge status-disconnected';
    };

    const getStatusText = (isConnected) => {
        return isConnected ? 'Connected' : 'Disconnected';
    };

    if (loading) {
        return <div className="loading-spinner">Loading robot details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!robot) {
        return <div className="not-found-message">Robot not found</div>;
    }

    return (
        <div className="robot-detail-container">
            <div className="back-navigation">
                <Link to="/robots" className="back-link">
                    &larr; Back to Robots
                </Link>
            </div>

            <div className="robot-detail-header">
                <h1>{robot.MachineName}</h1>
                <span className={getStatusClass(robot.IsConnected)}>
                    {getStatusText(robot.IsConnected)}
                </span>
            </div>

            <div className="robot-detail-card">
                <div className="detail-section">
                    <h2>Robot Information</h2>
                    <div className="detail-grid">
                        <div className="detail-item">
                        <span className="detail-label">ID</span>
                        <span className="detail-value">{robot.ID || robot.id}</span>
                        </div>
                        <div className="detail-item">
                        <span className="detail-label">Machine Name</span>
                        <span className="detail-value">{robot.MachineName || robot.machineName}</span>
                        </div>
            <div className="detail-item">
                <span className="detail-label">Machine Key</span>
                <span className="detail-value">{robot.MachineKey || robot.machineKey}</span>
            </div>
                        <div className="detail-item">
                            <span className="detail-label">Last Seen</span>
                            <span className="detail-value">
                                {new Date(robot.LastSeen).toLocaleString()}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className={getStatusClass(robot.IsConnected)}>
                                {getStatusText(robot.IsConnected)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Additional sections can be added here for more details */}
            </div>
        </div>
    );
};

export default RobotDetail; 