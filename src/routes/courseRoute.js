import express from "express";
import { GetCourse, postCourse } from "../controllers/courseController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import multer from "multer";
import { fileStorageCourse, fileFilter } from "../utils/multer.js";

const courseRoutes = express.Router();

// Konfigurasi multer dengan error handling
const upload = multer({
    storage: fileStorageCourse,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware untuk menangani error multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: "File size too large. Maximum size is 5MB",
                error: err.message
            });
        }
        return res.status(400).json({
            message: "Error uploading file",
            error: err.message
        });
    } else if (err) {
        return res.status(400).json({
            message: "Invalid file type",
            error: err.message
        });
    }
    next();
};

courseRoutes.get("/courses", verifyToken, GetCourse);
courseRoutes.post("/courses", 
    verifyToken, 
    upload.single("tumbhnail"),
    handleMulterError,
    postCourse
);

export default courseRoutes;
