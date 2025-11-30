import { apiInstanceWithAuth } from "../utils/axios";

export const getCourses = async () =>
  apiInstanceWithAuth.get("/courses").then((res) => res.data);

export const getCategories = async () =>
  apiInstanceWithAuth.get("/categories").then((res) => res.data);

export const getCoursesDetail = async (id) =>
  apiInstanceWithAuth.get(`/courses/${id}`).then((res) => res.data);

export const createCourses = async (data) =>
  apiInstanceWithAuth
    .post("/courses", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const updateCourses = async (data, id) =>
  apiInstanceWithAuth
    .put(`/courses/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const deleteCourses = async (id) => {
  apiInstanceWithAuth.delete(`/courses/${id}`).then((res) => res.data);
};
