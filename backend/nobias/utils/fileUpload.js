const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // ✅ Generate unique filename without fieldname prefix
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});

// ✅ Expanded allowed MIME types
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Case-insensitive check
    if (
      allowedTypes
        .map((t) => t.toLowerCase())
        .includes(file.mimetype.toLowerCase())
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type: ${
            file.mimetype
          }. Allowed types: ${allowedTypes.join(", ")}`
        ),
        false
      );
    }
  },
});

module.exports = upload;
