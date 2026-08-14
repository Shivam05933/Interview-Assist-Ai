const multer = require("multer");

// 🔥 FILE FILTER (IMPORTANT)
const fileFilter = (req, file, cb) => {
  // Allow only PDF
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// 🔥 MULTER CONFIG
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },

  fileFilter: fileFilter,
});

module.exports = upload;