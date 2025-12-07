import { apiInstanceWithAuth } from "../utils/axios";

export const getCourses = async () =>
  apiInstanceWithAuth.get("/courses").then((res) => res.data);

export const getCategories = async () =>
  apiInstanceWithAuth.get("/categories").then((res) => res.data);

export const getCoursesDetail = async (id, isPreview = false) =>
  apiInstanceWithAuth.get(`/courses/${id}${isPreview ? '?preview=true' : ''}`).then((res) => res.data);

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

export const createContent = async (data) => apiInstanceWithAuth.post("/courses/contents", data).then((res) => res.data);
export const updateContent = async (data, id) => apiInstanceWithAuth.put(`/courses/contents/${id}`, data).then((res) => res.data);
export const deleteContent = async (id) => apiInstanceWithAuth.delete(`/courses/contents/${id}`).then((res) => res.data);
export const getContentById = async (id) => apiInstanceWithAuth.get(`/courses/contents/${id}`).then((res) => res.data);
export const getCoursePreview = async (id) => apiInstanceWithAuth.get(`/courses/${id}/preview`).then((res) => res.data);
export const getDetailContent = async (id) => apiInstanceWithAuth.get(`/courses/contents/${id}`).then((res) => res.data);