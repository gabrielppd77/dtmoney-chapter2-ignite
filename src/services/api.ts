import axios from "axios";

export const api = axios.create({
    baseURL: 'htpp://localhost:3000/api'
})