import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export default api;
