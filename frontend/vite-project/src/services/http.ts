import axios from "axios"

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': "application/json"
    },

})
export default http