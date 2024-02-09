import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://65c2f65df7e6ea59682bceff.mockapi.io/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;