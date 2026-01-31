import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.6:3000/api';

const api = axios.create({
  baseURL,
});

export default api;
