import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInSchema = signUpSchema.omit({ name: true });

export const createCourseSchema = z.object({
  name: z.string().min(5),
  categoryId: z.string().min(5, { message: "Please select a category" }),
  tagline: z.string().min(5),
  description: z.string().min(10),
  thumbnail: z
    .any()
    .refine((file) => file?.name, { message: "Thumbnail is required" }),
});

export const updateCourseSchema = createCourseSchema.omit({ thumbnail: true });

export const mutateContentSchema = z
  .object({
    title: z.string().min(5),
    type: z.string().min(3, { message: "Type must be video or text" }),
    youtubeId: z.string().optional(),
    text: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    const parseVideoId = z.string().min(1).safeParse(val.youtubeId);
    const parseText = z.string().min(1).safeParse(val.text);

    if (val.type === "video" && !parseVideoId.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Youtube ID is required for video type",
        path: ["youtubeId"],
      });
    }

    if (val.type === "text" && !parseText.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Text content is required for text type",
        path: ["text"],
      });
    }
  });

export const createStudentSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(6),
  photo: z.any().refine((file) => file?.name, { message: "Photo is required" }),
});

export const updateStudentSchema = createStudentSchema.omit({
  password: true,
  photo: true,
});

export const addStudentCourseSchema = z.object({
  studentId: z.string().min(5),
})