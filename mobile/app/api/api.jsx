import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.30.15:3000/api', // IP do servidor
});

export default api;

