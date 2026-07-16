import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "https://interview-assist-ai.onrender.com"),
    withCredentials: true,
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        console.error("Register failed:", err.response?.data || err.message)
        throw new Error(err.response?.data?.message || "Registration failed. Please try again.")
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.error("Login failed:", err.response?.data || err.message)
        throw new Error(err.response?.data?.message || "Login failed. Please try again.")
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {
        console.error("Logout failed:", err.response?.data || err.message)
        throw err; // taaki component handle kare
    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.error("Get me failed:", err.response?.data || err.message)
        throw new Error(err.response?.data?.message || "Unable to load your account right now.")
    }

}