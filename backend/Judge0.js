// backend/judge0.js
const axios = require('axios');

// Base URL for Judge0 API
const BASE_URL = 'https://judge0-ce.p.rapidapi.com/';

// Create an Axios instance with a custom config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'x-rapidapi-key': 'd39007e948msh74058de8317a7c7p18c44bjsn501da074a20d',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  },
});

const submitCode = async (code, language_id) => {
  try {
    const response = await axiosInstance.post('/submissions?base64_encoded=false', {
      source_code: code,
      language_id: language_id,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting code:', error);
    throw error;
  }
};

const getSubmissionResult = async (key) => {
  try {
    const response = await axiosInstance.get(`/submissions/${key}?base64_encoded=false`);
    return response.data;
  } catch (error) {
    console.error('Error fetching submission result:', error);
    throw error;
  }
};

module.exports = {
  submitCode,
  getSubmissionResult,
};
