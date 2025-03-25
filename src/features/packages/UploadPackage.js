// src/features/packages/UploadPackage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import botPackageService from '../../services/botPackageService';
import './UploadPackage.css';

const UploadPackage = () => {
    const navigate = useNavigate();
    const [packageFile, setPackageFile] = useState(null);
    const [packageName, setPackageName] = useState('');
    const [packageVersion, setPackageVersion] = useState('');
    const [packageDescription, setPackageDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileError, setFileError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) {
            setPackageFile(null);
            setFileError(null);
            return;
        }
        
        // Validate file type
        if (!file.name.endsWith('.zip') && !file.name.endsWith('.nupkg')) {
            setFileError('Only ZIP or NuGet packages are allowed');
            setPackageFile(null);
            return;
        }
        
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            setFileError('File size must be less than 10MB');
            setPackageFile(null);
            return;
        }
        
        setFileError(null);
        setPackageFile(file);
        
        // Try to extract name and version from file name
        // Example: "MyPackage-1.0.0.zip" -> name: "MyPackage", version: "1.0.0"
        const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
        const parts = fileNameWithoutExt.split('-');
        
        if (parts.length >= 2) {
            const versionPart = parts.pop();
            const namePart = parts.join('-');
            
            if (/^\d+(\.\d+)*$/.test(versionPart)) {
                setPackageName(namePart);
                setPackageVersion(versionPart);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!packageFile) {
            setFileError('Please select a package file');
            return;
        }
        
        if (!packageName.trim()) {
            setError('Package name is required');
            return;
        }
        
        if (!packageVersion.trim()) {
            setError('Package version is required');
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const formData = new FormData();
            formData.append('file', packageFile);
            formData.append('name', packageName);
            formData.append('version', packageVersion);
            formData.append('description', packageDescription);
            
            await botPackageService.uploadPackage(formData);
            
            // Navigate back to package list
            navigate('/packages');
        } catch (err) {
            console.error('Error uploading package:', err);
            setError(err.message || 'Failed to upload package');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-package-container">
            <div className="back-navigation">
                <button 
                    onClick={() => navigate('/packages')} 
                    className="back-button"
                >
                    &larr; Back to Packages
                </button>
            </div>
            
            <h1>Upload Bot Package</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="upload-form-card">
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <label htmlFor="packageFile">Package File</label>
                        <div className="file-upload-container">
                            <input
                                type="file"
                                id="packageFile"
                                onChange={handleFileChange}
                                accept=".zip,.nupkg"
                                className="file-input"
                            />
                            <div className="file-upload-button">
                                Choose File
                            </div>
                            <div className="file-name">
                                {packageFile ? packageFile.name : 'No file chosen'}
                            </div>
                        </div>
                        {fileError && <div className="field-error">{fileError}</div>}
                        <div className="file-requirements">
                            Accepted formats: .zip, .nupkg (Max size: 10MB)
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="packageName">Package Name</label>
                        <input
                            type="text"
                            id="packageName"
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="packageVersion">Version</label>
                        <input
                            type="text"
                            id="packageVersion"
                            value={packageVersion}
                            onChange={(e) => setPackageVersion(e.target.value)}
                            placeholder="e.g. 1.0.0"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="packageDescription">Description</label>
                        <textarea
                            id="packageDescription"
                            value={packageDescription}
                            onChange={(e) => setPackageDescription(e.target.value)}
                            rows={4}
                            placeholder="Enter package description (optional)"
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/packages')}
                            className="cancel-button"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="upload-button"
                            disabled={loading || !packageFile}
                        >
                            {loading ? 'Uploading...' : 'Upload Package'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadPackage;