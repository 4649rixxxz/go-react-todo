import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/',
    responseType: 'json',
    withCredentials: true
})

export {apiClient}