const multer = require("multer");

//Storage configuration
const storage = multer.memoryStorage();

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
