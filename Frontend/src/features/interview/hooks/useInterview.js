import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })

            if (!response || !response.interviewReport) {
                throw new Error("Invalid response from backend")
            }

            console.log("INTERVIEW REPORT (generate):", response.interviewReport)
            console.log("TECHNICAL QUESTIONS:", response.interviewReport?.technicalQuestions)
            console.log("BEHAVIORAL QUESTIONS:", response.interviewReport?.behavioralQuestions)
            console.log("ROADMAP:", response.interviewReport?.roadmap)
            console.log("MISSING SKILLS:", response.interviewReport?.missingSkills)
            console.log("STRONG SKILLS:", response.interviewReport?.strongSkills)

            setReport(response.interviewReport)
            return response.interviewReport

        } catch (error) {
            console.error("Generate Report Error:", error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)

            if (!response || !response.interviewReport) {
                throw new Error("Invalid response from backend")
            }

            console.log("INTERVIEW REPORT:", response.interviewReport)
            console.log("TECHNICAL QUESTIONS:", response.interviewReport?.technicalQuestions)
            console.log("BEHAVIORAL QUESTIONS:", response.interviewReport?.behavioralQuestions)
            console.log("ROADMAP:", response.interviewReport?.roadmap)
            console.log("MISSING SKILLS:", response.interviewReport?.missingSkills)
            console.log("STRONG SKILLS:", response.interviewReport?.strongSkills)

            setReport(response.interviewReport)
            return response.interviewReport

        } catch (error) {
            console.error("Get Report By ID Error:", error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()

            if (!response || !response.interviewReports) {
                throw new Error("Invalid response from backend")
            }

            setReports(response.interviewReports)
            return response.interviewReports

        } catch (error) {
            console.error("Get Reports Error:", error)
            return []
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        if (!interviewReportId) return
        setLoading(true)
        try {
            // generateResumePdf returns a Blob (response.data from API)
            const pdfBlob = await generateResumePdf(interviewReportId)

            const url = window.URL.createObjectURL(pdfBlob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

        } catch (error) {
            console.error("PDF Download Error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}