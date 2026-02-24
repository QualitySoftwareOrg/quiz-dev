import axios from "axios";
import { Platform } from 'react-native';

const envBaseURL = process.env.EXPO_PUBLIC_API_URL;
const baseURL = envBaseURL || (Platform.OS === 'web' ? 'http://localhost:3000/api' : undefined);

if (!baseURL) {
  throw new Error('EXPO_PUBLIC_API_URL nao configurada. Defina no .env (ex: http://SEU_IP:3000/api).');
}

const api = axios.create({
  baseURL,
});

export default api;
