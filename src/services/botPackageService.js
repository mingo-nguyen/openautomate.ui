// src/services/botPackageService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://27.66.25.144:8081/api';

// Helper function for truthy values
const isTruthy = (value) => {
    if (value === true) return true;
    if (value === 'true') return true;
    if (value === 1) return true;
    if (value === '1') return true;
    return false;
};

const botPackageService = {
    getAllPackages: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.get(`${API_URL}/APIBotPackage`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user.token ? `Bearer ${user.token}` : ''
                }
            });
            
            return response.data.map(pkg => ({
                id: pkg.ID || pkg.id,
                name: pkg.Name || pkg.name,
                version: pkg.Version || pkg.version,
                description: pkg.Description || pkg.description,
                uploadDate: pkg.UploadDate || pkg.uploadDate,
                fileSize: pkg.FileSize || pkg.fileSize,
                filePath: pkg.FilePath || pkg.filePath
            }));
        } catch (error) {
            console.error("Error fetching bot packages:", error);
            throw error.response?.data || { message: 'Failed to fetch bot packages' };
        }
    },
    
    getPackageById: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.get(`${API_URL}/APIBotPackage/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user.token ? `Bearer ${user.token}` : ''
                }
            });
            
            const pkg = response.data;
            return {
                id: pkg.ID || pkg.id,
                name: pkg.Name || pkg.name,
                version: pkg.Version || pkg.version,
                description: pkg.Description || pkg.description,
                uploadDate: pkg.UploadDate || pkg.uploadDate,
                fileSize: pkg.FileSize || pkg.fileSize,
                filePath: pkg.FilePath || pkg.filePath
            };
        } catch (error) {
            console.error(`Error fetching bot package ${id}:`, error);
            throw error.response?.data || { message: 'Failed to fetch bot package details' };
        }
    },
    
    uploadPackage: async (formData) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.post(`${API_URL}/APIBotPackage/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': user.token ? `Bearer ${user.token}` : ''
                }
            });
            
            return response.data;
        } catch (error) {
            console.error("Error uploading bot package:", error);
            throw error.response?.data || { message: 'Failed to upload bot package' };
        }
    },
    
    deletePackage: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.delete(`${API_URL}/APIBotPackage/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user.token ? `Bearer ${user.token}` : ''
                }
            });
            
            return response.data;
        } catch (error) {
            console.error(`Error deleting bot package ${id}:`, error);
            throw error.response?.data || { message: 'Failed to delete bot package' };
        }
    },
    
    deployPackage: async (packageId, robotId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.post(`${API_URL}/APIBotPackage/deploy`, 
                { 
                    PackageId: packageId,
                    RobotId: robotId 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': user.token ? `Bearer ${user.token}` : ''
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error deploying package ${packageId} to robot ${robotId}:`, error);
            throw error.response?.data || { message: 'Failed to deploy bot package' };
        }
    }
};

export default botPackageService;