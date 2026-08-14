const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

console.log(interviewController)
console.log(authMiddleware)
// Generate report
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController
);

// Get single report
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

// Get all reports
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

// Generate resume PDF
interviewRouter.post(
  "/:interviewReportId/resume/pdf",
  authMiddleware.authUser,
  interviewController.generateResumePdfController
);



module.exports = interviewRouter;