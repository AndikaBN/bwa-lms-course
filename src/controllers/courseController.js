import courseModel from "../models/courseModel.js";
import categoryModel from "../models/categoryModel.js";
import { mutateCourseSchema } from "../utils/schema.js";
import fs from "fs";
import userModel from "../models/userModel.js";
import path from "path";

export const GetCourse = async (req, res) => {
  try {
    const courses = await courseModel
      .find({
        manager: req.user?._id,
      })
      .select("name thumbnail")
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "students",
        select: "name",
      });

    const imageUrl = process.env.APP_URL + "/uploads/courses/";

    const response = courses.map((item) => {
      return {
        ...item.toObject(),
        thumbnail_url: imageUrl + item.thumbnail,
        total_students: item.students.length,
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

export const GetCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseModel.findById(id);

    return res.json({
      message: "get Course success",
      data: course,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const GetCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    return res.json({
      message: "Get Categories Success",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const postCourse = async (req, res) => {
  try {
    const body = req.body;

    const parse = mutateCourseSchema.safeParse(body);

    if (!parse.success) {
      const errorMessages = parse.error.issues.map((err) => err.message);

      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req?.file?.path);
      }

      return res.status(500).json({
        message: "Validation Error",
        data: null,
        errors: errorMessages,
      });
    }

    const category = await categoryModel.findById(parse.data.categoryId);

    if (!category) {
      return res.status(500).json({
        message: "Category not found",
        data: null,
      });
    }

    const course = new courseModel({
      name: parse.data.name,
      category: category._id,
      description: parse.data.description,
      tagline: parse.data.tagline,
      thumbnail: req.file?.filename,
      manager: req.user._id,
    });

    await course.save();

    await categoryModel.findByIdAndUpdate(
      category._id,
      {
        $push: {
          courses: course._id,
        },
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      req.user?._id,
      {
        $push: {
          courses: course._id,
        },
      },
      { new: true }
    );

    return res.json({
      message: "Create Course Success",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const body = req.body;
    const courseId = req.params.id;

    const parse = mutateCourseSchema.safeParse(body);

    if (!parse.success) {
      const errorMessages = parse.error.issues.map((err) => err.message);

      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req?.file?.path);
      }

      return res.status(500).json({
        message: "Validation Error",
        data: null,
        errors: errorMessages,
      });
    }

    const category = await categoryModel.findById(parse.data.categoryId);
    const oldCourse = await courseModel.findById(courseId);

    if (!category) {
      return res.status(500).json({
        message: "Category not found",
        data: null,
      });
    }

    await courseModel.findByIdAndUpdate(courseId, {
      name: parse.data.name,
      category: category._id,
      description: parse.data.description,
      tagline: parse.data.tagline,
      thumbnail: req?.file ? req.file?.filename : oldCourse.thumbnail,
      manager: req.user._id,
    });

    return res.json({
      message: "Update Course Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseModel.findById(id);

    const dirname = path.resolve()
    
    const filePath = path.join(dirname, "public/uploads/courses", course.thumbnail);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await courseModel.findByIdAndDelete(id)

    return res.json({
      message: "Delete course succes" 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    })
  }
};
