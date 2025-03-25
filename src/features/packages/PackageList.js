// src/features/packages/PackageList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import botPackageService from '../../services/botPackageService';
import './PackageList.css';

const PackageList = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const data = await botPackageService.getAllPackages();
            console.log("Package data:", data);
            setPackages(data);
            setError(null);
        } catch (err) {
            setError('Failed to load bot packages. Please try again later.');
            console.error('Error fetching bot packages:', err);
        } finally {
            setLoading(false);
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

    if (loading) {
        return <div className="loading-spinner">Loading bot packages...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="package-list-container">
            <div className="package-list-header">
                <h1>Bot Packages</h1>
                <Link to="/packages/upload" className="upload-package-button">
                    Upload Package
                </Link>
            </div>
            
            {packages.length === 0 ? (
                <div className="no-packages-message">
                    <p>No bot packages found. Click "Upload Package" to add one.</p>
                </div>
            ) : (
                <div className="package-grid">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="package-card">
                            <div className="package-card-header">
                                <h3>{pkg.name}</h3>
                                <span className="version-badge">v{pkg.version}</span>
                            </div>
                            <div className="package-card-body">
                                <p className="package-description">{pkg.description || 'No description available'}</p>
                                <div className="package-meta">
                                    <p><strong>Upload Date:</strong> {formatDate(pkg.uploadDate)}</p>
                                    <p><strong>File Size:</strong> {formatFileSize(pkg.fileSize)}</p>
                                </div>
                            </div>
                            <div className="package-card-footer">
                                <Link to={`/packages/details/${pkg.id}`} className="view-details-button">
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

export default PackageList;