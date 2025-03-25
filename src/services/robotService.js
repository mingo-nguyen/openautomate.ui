import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://27.66.25.144:8081/api';
const isTruthy = (value) => {
    if (value === true) return true;
    if (value === 'true') return true;
    if (value === 1) return true;
    if (value === '1') return true;
    return false;
};
const robotService = {
    getAllRobots: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.get(`${API_URL}/APIRobot`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user.token ? `Bearer ${user.token}` : ''
                }
            });
            
            // Transform the data to normalize property names
            return response.data.map(robot => ({
                id: robot.ID || robot.id,
                machineName: robot.MachineName || robot.machineName,
                machineKey: robot.MachineKey || robot.machineKey,
                isConnected: isTruthy(robot.IsConnected) || isTruthy(robot.isConnected),
                lastSeen: robot.LastSeen || robot.lastSeen || new Date().toISOString()
            }));
        } catch (error) {
            console.error("Error fetching robots:", error);
            throw error.response?.data || { message: 'Failed to fetch robots' };
        }
    },

    getConnectedRobots: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/APIRobot`);
          return response.data.filter(robot => robot.isConnected === true);
        } catch (error) {
          handleApiError(error, 'Failed to fetch connected robots');
          throw error;
        }
      },
    
    getRobotById: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.get(`${API_URL}/APIRobot/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user.token ? `Bearer ${user.token}` : ''
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching robot ${id}:`, error);
            throw error.response?.data || { message: 'Failed to fetch robot details' };
        }
    },
    
    createRobot: async (machineName) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.post(`${API_URL}/APIRobot`, 
                { MachineName: machineName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': user.token ? `Bearer ${user.token}` : ''
                    }
                }
            );
            
            // Adapt the response to match what your component expects
            return {
                MachineName: response.data.machineName,
                MachineKey: response.data.machineKey,
                message: response.data.message
            };
        } catch (error) {
            console.error("Error creating robot:", error);
            throw error.response?.data || { message: 'Failed to create robot' };
        }
    },
    
    updateRobot: async (id, machineName) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.put(`${API_URL}/APIRobot/${id}`, 
                { MachineName: machineName },
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
            console.error(`Error updating robot ${id}:`, error);
            throw error.response?.data || { message: 'Failed to update robot' };
        }
    },
    
    deleteRobot: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const response = await axios.delete(`${API_URL}/APIRobot/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user.token ? `Bearer ${user.token}` : ''
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting robot ${id}:`, error);
            throw error.response?.data || { message: 'Failed to delete robot' };
        }
    }
};

export default robotService;