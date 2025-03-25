// src/features/packages/PackageDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import botPackageService from '../../services/botPackageService';
import robotService from '../../services/robotService';
import './PackageDetail.css';

// Modal component for deploying a package to a robot
const DeployPackageModal = ({ isOpen, onClose, packageId, onDeploy }) => {
    const [robots, setRobots] = useState([]);
    const [selectedRobotId, setSelectedRobotId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchRobots();
        }
    }, [isOpen]);

    const fetchRobots = async () => {
        try {
            setLoading(true);
            const data = await robotService.getAllRobots();
            // Filter to only connected robots
            const connectedRobots = data.filter(robot => robot.isConnected);
            setRobots(connectedRobots);
            
            if (connectedRobots.length > 0) {
                setSelectedRobotId(connectedRobots[0].id);
            }
            
            setError(null);
        } catch (err) {
            setError('Failed to load robots. Please try again later.');
            console.error('Error fetching robots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeploy = async () => {
        if (!selectedRobotId) {
            setError('Please select a robot');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            
            await botPackageService.deployPackage(packageId, selectedRobotId);
            setSuccess('Package deployment initiated successfully!');
            
            if (onDeploy) {
                onDeploy(selectedRobotId);
            }
            
            // Close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to deploy package. Please try again later.');
            console.error('Error deploying package:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Deploy Package to Robot</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    {loading && <div className="modal-loading">Loading...</div>}
                    
                    {error && <div className="modal-error">{error}</div>}
                    
                    {success && <div className="modal-success">{success}</div>}
                    
                    {!loading && !success && (
                        <>
                            {robots.length === 0 ? (
                                <p className="no-robots-message">
                                    No connected robots available. Please ensure a robot is online before deploying.
                                </p>
                            ) : (
                                <div className="form-group">
                                    <label htmlFor="robot-select">Select Robot:</label>
                                    <select 
                                        id="robot-select"
                                        value={selectedRobotId}
                                        onChange={(e) => setSelectedRobotId(e.target.value)}
                                        disabled={loading}
                                    >
                                        {robots.map(robot => (
                                            <option key={robot.id} value={robot.id}>
                                                {robot.machineName} {robot.isConnected ? '(Connected)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="cancel-button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    
                    <button 
                        className="deploy-button"
                        onClick={handleDeploy}
                        disabled={loading || robots.length === 0 || success}
                    >
                        {loading ? 'Deploying...' : 'Deploy Package'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PackageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deployModalOpen, setDeployModalOpen] = useState(false);
    const [deployedRobots, setDeployedRobots] = useState([]);

    useEffect(() => {
        fetchPackageDetails();
    }, [id]);

    const fetchPackageDetails = async () => {
        try {
            setLoading(true);
            const data = await botPackageService.getPackageById(id);
            console.log("Package details:", data);
            setPackage(data);
            setError(null);
        } catch (err) {
            setError('Failed to load package details. Please try again later.');
            console.error('Error fetching package details:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await botPackageService.deletePackage(id);
            navigate('/packages');
        } catch (err) {
            setError('Failed to delete package. Please try again later.');
            console.error('Error deleting package:', err);
            setDeleteConfirm(false);
        } finally {
            setDeleteLoading(false);
        }
    };
    
    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        
        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${kb.toFixed(2)} KB`;
        }
        
        const mb = kb / 1024;
        return `${mb.toFixed(2)} MB`;
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleString();
    };
    
    const handleDeploySuccess = (robotId) => {
        setDeployedRobots([...deployedRobots, robotId]);
    };

    if (loading) {
        return <div className="loading-spinner">Loading package details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!pkg) {
        return <div className="not-found-message">Package not found</div>;
    }

    return (
        <div className="package-detail-container">
            <div className="back-navigation">
                <Link to="/packages" className="back-link">
                    &larr; Back to Packages
                </Link>
            </div>
            
            <div className="package-detail-header">
                <div>
                    <h1>{pkg.name}</h1>
                    <span className="version-badge">v{pkg.version}</span>
                </div>
                
                <div className="header-actions">
                    {!deleteConfirm ? (
                        <button 
                            className="delete-button"
                            onClick={() => setDeleteConfirm(true)}
                        >
                            Delete Package
                        </button>
                    ) : (
                        <div className="delete-confirm">
                            <span>Are you sure?</span>
                            <button 
                                className="cancel-delete-button"
                                onClick={() => setDeleteConfirm(false)}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirm-delete-button"
                                onClick={handleDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="package-detail-card">
                <div className="detail-section">
                    <h2>Package Details</h2>
                    
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Package Name</span>
                            <span className="detail-value">{pkg.name}</span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Version</span>
                            <span className="detail-value">{pkg.version}</span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Upload Date</span>
                            <span className="detail-value">{formatDate(pkg.uploadDate)}</span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">File Size</span>
                            <span className="detail-value">{formatFileSize(pkg.fileSize)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="detail-section">
                    <h2>Description</h2>
                    <p className="package-description">
                        {pkg.description || 'No description available for this package.'}
                    </p>
                </div>
                
                <div className="detail-section">
                    <h2>Actions</h2>
                    <div className="package-actions">
                        <a 
                            href={`${process.env.REACT_APP_API_URL || 'http://27.66.25.144:8081/api'}/APIBotPackage/download/${pkg.id}`} 
                            className="download-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download Package
                        </a>
                        
                        <button 
                            className="deploy-button"
                            onClick={() => setDeployModalOpen(true)}
                        >
                            Deploy to Robot
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Deploy Package Modal */}
            <DeployPackageModal 
                isOpen={deployModalOpen}
                onClose={() => setDeployModalOpen(false)}
                packageId={pkg.id}
                onDeploy={handleDeploySuccess}
            />
        </div>
    );
};

export default PackageDetail;