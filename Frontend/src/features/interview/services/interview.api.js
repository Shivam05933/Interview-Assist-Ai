import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 
        (import.meta.env.DEV 
            ? "http://localhost:5000" 
            : "https://interview-assist-ai.onrender.com"),
    withCredentials: true,
})

/**
 * Generate Interview Report
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    try {
        const formData = new FormData()

        formData.append("jobDescription", jobDescription)
        formData.append("selfDescription", selfDescription)
        if (resumeFile) {
            formData.append("resume", resumeFile)
        }

        const response = await api.post("/api/interview", formData)

        return response.data

    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" }
    }
}

/**
 * Get Interview Report by ID
 */
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch report" }
    }
}

/**
 * Get All Interview Reports
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview")
        return response.data
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch reports" }
    }
}

/**
 * Generate Resume PDF
 */
export const generateResumePdf = async (interviewReportId) => {
    try {
        const response = await api.post(
            `/api/interview/resume/pdf/${interviewReportId}`,
            null,
            { responseType: "blob" }
        )

        // response.data is already a Blob because responseType is 'blob'
        return response.data

    } catch (error) {
        throw error.response?.data || { message: "Failed to generate PDF" }
    }
}