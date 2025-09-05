import axios from 'axios';

const baseURL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const url = (path: string) => `${baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
