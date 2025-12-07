import userModel from "../models/userModel.js";
import bycrypt from "bcryptjs";
import { mutateStudentSchema } from "../utils/schema.js";
import courseModel from "../models/courseModel.js";
import fs from "fs";
import path from "path";

export const getStudents = async (req, res) => {
  try {
    const students = await userModel
      .find({
        role: "student",
        manager: req.user._id,
      })
      .select("name email photo");

    const imageUrl = process.env.APP_URL + "/uploads/students/";

    const response = students.map((item) => {
      return {
        ...item.toObject(),
        photo_url: imageUrl + item.photo,
      };
    });

    return res.json({
      message: "Get Students Success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const postStudent = async (req, res) => {
  try {
    const body = req.body;

    const parse = mutateStudentSchema.safeParse(body);

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

    const hashPassword = bycrypt.hashSync(body.password, 12);

    const student = new userModel({
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      photo: req.file?.filename,
      manager: req.user._id,
      role: "student",
    });

    await student.save();

    return res.json({
      message: "Create Student Success",
      data: student,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const parse = mutateStudentSchema
      .partial({
        password: true,
      })
      .safeParse(body);

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

    const student = await userModel.findById(id);

    const hashPassword = parse.data?.password
      ? bycrypt.hashSync(parse.data.password, 12)
      : student.password;

    await userModel.findByIdAndUpdate(id, {
      name: parse.data.name || student.name,
      email: parse.data.email || student.email,
      password: hashPassword,
      photo: req.file ? req.file?.filename : student.photo,
    });

    // const student = new userModel({
    //     name: parse.data.name,
    //     email: parse.data.email,
    //     password: hashPassword,
    //     photo: req.file?.filename,
    //     manager: req.user._id,
    //     role: "student",
    // });

    // await student.save();

    return res.json({
      message: "update Student Success",
      data: student,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await userModel.findById(id);
    await courseModel.findOneAndUpdate(
      {
        students: id,
      },
      {
        $pull: {
          students: id,
        },
      }
    );

    const dirname = path.resolve();

    const filePath = path.join(
      dirname,
      "public/uploads/students",
      student.photo
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await userModel.findByIdAndDelete(id);

    return res.json({
      message: "Delete Student Success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
