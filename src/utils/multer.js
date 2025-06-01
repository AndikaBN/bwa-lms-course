import multer from "multer";
import path from "path";

export const fileStorageCourse = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/courses");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqId = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqId}${ext}`);
    }
});

export const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, JPG and PNG are allowed."), false);
    }
};
