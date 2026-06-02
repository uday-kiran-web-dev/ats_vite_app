const fs = require("fs");
const multer = require("multer");
const path = require("path");

const resumeUploadDir = path.join(__dirname, "uploads", "resumes");
fs.mkdirSync(resumeUploadDir, { recursive: true });

//Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumeUploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC/DOCX types allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
