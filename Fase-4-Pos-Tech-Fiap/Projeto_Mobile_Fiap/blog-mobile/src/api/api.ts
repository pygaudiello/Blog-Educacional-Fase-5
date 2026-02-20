import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE = Platform.select({
  android: 'http://10.0.2.2:4000',
  ios: 'http://localhost:4000',
  default: 'http://192.168.0.11:4000',
  // Olaar, para quem ler coloque seu IP local aqui (Coloque no formato 'http://seu-ip:porta', sugiro colocar a porta 4000)
});

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});
