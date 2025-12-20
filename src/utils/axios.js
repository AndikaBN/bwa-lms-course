import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEY } from "./const";

const baseURL = import.meta.env.VITE_API_URL;

const apiInstance = axios.create({
    baseURL,
    timeout: 3000,
});

export const apiInstanceWithAuth = axios.create({
    baseURL,
    timeout: 3000,
});

apiInstanceWithAuth.interceptors.request.use((config) => {
    const session = secureLocalStorage.getItem(STORAGE_KEY);
    if (!session ) {
        return config;
    }

    config.headers.Authorization = `JWT ${session.token}`;
    return config;
});

apiInstanceWithAuth.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 400) {
            secureLocalStorage.removeItem(STORAGE_KEY);
            window.location.replace("/manager/sign-in");
        }
        return Promise.reject(error);
    }
);

export default apiInstance;