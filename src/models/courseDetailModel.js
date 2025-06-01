import mongoose from "mongoose";
import { string } from "zod";

const courseDetailModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['video', 'text'],
        default: 'video',
    },
    videoId: String,
    text: String,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }
}, {
    timestamps: true,
})

export default mongoose.model("CourseDetail", courseDetailModel);