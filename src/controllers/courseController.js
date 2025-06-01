import courseModel from "../models/courseModel.js";
import categoryModel from "../models/categoryModel.js";
import { mutateCourseSchema } from "../utils/schema.js";
import fs from "fs";
import userModel from "../models/userModel.js";

export const GetCourse = async (req, res) => {
  try {
    const courses = await courseModel
      .find({
        manager: req.user?._id,
      })
      .select("name tumbhnail")
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "students",
        select: "name",
      });

    const imageUrl = process.env.APP_URL;

    const response = courses.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        tumbhnail: imageUrl + obj.tumbhnail,
        total_students: Array.isArray(obj.students) ? obj.students.length : 0,
      };
    });

    return res.json({
      message: "Get Course Success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const postCourse = async (req, res) => {
  try {
    const body = req.body;

    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    // Validasi file upload
    if (!req.file) {
      return res.status(400).json({
        message: "Thumbnail image is required",
        data: null,
      });
    }

    const parse = mutateCourseSchema.safeParse(body);

    if (!parse.success) {
      // Hapus file jika validasi gagal
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      const errorsMessage = parse.error.issues.map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        data: null,
        errors: errorsMessage,
      });
    }

    const category = await categoryModel.findById(parse.data.categoryId);

    if (!category) {
      // Hapus file jika kategori tidak ditemukan
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        message: "Category not found",
        data: null,
      });
    }

    const course = new courseModel({
      name: parse.data.name,
      category: category._id,
      description: parse.data.description,
      tagline: parse.data.tagline,
      tumbhnail: req.file.path.replace(/\\/g, '/').replace(/^public\//, ''),
      manager: req.user._id,
    });

    await course.save();

    await categoryModel.findByIdAndUpdate(category._id, {
      $push: {
        courses: course._id,
      },
    }, { new: true });

    await userModel.findByIdAndUpdate(req.user?._id, {
      $push: {
        courses: course._id,
      }
    }, { new: true });

    return res.json({
      message: "Create Course Success",
      data: course,
    });
  } catch (error) {
    // Hapus file jika terjadi error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
