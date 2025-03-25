import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import robotService from '../../services/robotService';
import './CreateRobot.css';

const CreateRobot = () => {
    const navigate = useNavigate();
    const [machineName, setMachineName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [machineKey, setMachineKey] = useState(null);
    const [isCreated, setIsCreated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!machineName.trim()) {
            setError('Machine name is required');
            return;
        }
    
        try {
            setLoading(true);
            setError(null);
            const result = await robotService.createRobot(machineName);
            console.log("Create robot result:", result); // For debugging
            setMachineKey(result.MachineKey || result.machineKey);
            setIsCreated(true);
        } catch (err) {
            console.error('Error creating robot:', err);
            setError(err.message || 'Failed to create robot');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyMachineKey = () => {
        navigator.clipboard.writeText(machineKey);
        alert('Machine key copied to clipboard!');
    };

    const handleDone = () => {
        navigate('/robots');
    };

    return (
        <div className="create-robot-container">
            <h1>Add Robot</h1>
            
            {!isCreated ? (
                <div className="create-robot-form-container">
                    <p className="form-description">
                        Add a new robot to the system. Provide a unique name that identifies this machine.
                    </p>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="create-robot-form">
                        <div className="form-group">
                            <label htmlFor="machineName">Machine Name</label>
                            <input
                                type="text"
                                id="machineName"
                                value={machineName}
                                onChange={(e) => setMachineName(e.target.value)}
                                disabled={loading}
                                placeholder="Enter machine name"
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => navigate('/robots')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="create-button"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Robot'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="robot-created-container">
                    <div className="success-icon">✓</div>
                    <h2>Robot Created Successfully</h2>
                    <p>Your robot has been created with the following details:</p>
                    
                    <div className="robot-details">
                        <div className="detail-item">
                            <span className="detail-label">Machine Name:</span>
                            <span className="detail-value">{machineName}</span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Machine Key:</span>
                            <div className="machine-key-container">
                                <span className="detail-value machine-key">{machineKey}</span>
                                <button 
                                    className="copy-button" 
                                    onClick={handleCopyMachineKey}
                                    title="Copy to clipboard"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="important-note">
                        <strong>Important:</strong> Save this machine key. It will be required when connecting the robot to the system.
                    </div>
                    
                    <button className="done-button" onClick={handleDone}>
                        Done
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateRobot; 