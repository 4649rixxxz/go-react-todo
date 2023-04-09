import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:80/',
    responseType: 'json',
    withCredentials: true
})

export {apiClient}