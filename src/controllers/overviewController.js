import courseModel from "../models/courseModel.js";

export const getOverviews = async (req, res) => {
  try {
    const totalCourses = await courseModel
      .find({
        manager: req.user._id,
      })
      .countDocuments();

    const courses = await courseModel.find({
      manager: req.user._id,
    });

    const totalStudents = courses.reduce(
      (acc, curr) => acc + curr.students.length,
      0
    );

    const coursesVideos = await courseModel
      .find({
        manager: req.user._id,
      })
      .populate({
        path: "details",
        select: "name type",
        match: { type: "video" },
      });

    const totalVideos = coursesVideos.reduce(
      (acc, curr) => acc + curr.details.length,
      0
    );

    const coursesText = await courseModel
      .find({
        manager: req.user._id,
      })
      .populate({
        path: "details",
        select: "name type",
        match: { type: "text" },
      });

    const totalTexts = coursesText.reduce(
      (acc, curr) => acc + curr.details.length,
      0
    );

    return res.json({
      message: "get oveviews success",
      data: {
        totalCourses,
        totalStudents,
        totalVideos,
        totalTexts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
