import Axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' ?
    '/api/' :
    'http://localhost:3000/api';



const axios = Axios.create({
    withCredentials: true,
});

interface axiosService {
    get<T>(endpoint: string, data?: any, params?: any): Promise<T>;
    post<T>(endpoint: string, data?: any): Promise<T>;
    put<T>(endpoint: string, data?: any): Promise<T>;
    delete<T>(endpoint: string, data?: any): Promise<T>;
}

const axiosService: axiosService = {
    async get<T>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'GET', data);
    },
    async post<T>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'POST', data);
    },
    async put<T>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'PUT', data);
    },
    async delete<T>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'DELETE', data);
    },
};

async function ajax<T>(endpoint: string, method: string = 'GET', data: any = null): Promise<T> {
    try {
        const config: AxiosRequestConfig = {
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null,
        };
        const res = await axios(config);
        return res.data;
    } catch (err: any) {
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data:`, data);
        console.dir(err);
        if (err.response && err.response.status === 401) {
            window.location.href = '/login';
        }
        throw err;
    }
}

export default axiosService;