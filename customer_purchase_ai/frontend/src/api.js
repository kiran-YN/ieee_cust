import axios from 'axios';

const API_URL = '/api';

export const uploadDataset = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const trainModel = async () => {
    const response = await axios.post(`${API_URL}/train`);
    return response.data;
};

export const predictPurchase = async (data) => {
    const response = await axios.post(`${API_URL}/predict`, data);
    return response.data;
};

export const getMetrics = async () => {
    const response = await axios.get(`${API_URL}/metrics`);
    return response.data;
};
