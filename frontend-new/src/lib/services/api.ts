import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Endpoints } from '../enums/endpoints';

const TOKEN_KEY = 'token';

class ApiService {
    private client: AxiosInstance;

    constructor(token: string | null) {
        const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
        this.client = axios.create({
            baseURL,
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });
    }

    // Method to update the token
    public setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
        this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    // GET request
    public get<T>(endpoint: Endpoints, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.get(endpoint, config);
    }

    // POST request
    public post<T>(endpoint: Endpoints, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.post(endpoint, data, config);
    }

    // PUT request
    public put<T>(endpoint: Endpoints, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.put(endpoint, data, config);
    }

    // DELETE request
    public delete<T>(endpoint: Endpoints, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.delete(endpoint, config);
    }

    // PATCH request
    public patch<T>(endpoint: Endpoints, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.patch(endpoint, data, config);
    }
}

export const apiService = new ApiService(localStorage.getItem(TOKEN_KEY));
