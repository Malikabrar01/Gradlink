import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.parse(file.originalname).name;
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  },
});

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    ALLOWED_MIME.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPG, PNG, WEBP or PDF files are allowed")),
});
