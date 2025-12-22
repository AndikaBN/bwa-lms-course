import { apiInstanceWithAuth } from "../utils/axios";

export const getStudents = async () =>
  apiInstanceWithAuth.get("students").then((res) => res.data);

export const getStudentDetail = async (id) =>
  apiInstanceWithAuth.get(`students/${id}`).then((res) => res.data);

export const createStudents = async (data) =>
  apiInstanceWithAuth
    .post("/students", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const updateStudent = async (data, id) =>
  apiInstanceWithAuth
    .put(`/students/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const deleteStudent = async (id) =>
  apiInstanceWithAuth.delete(`/students/${id}`).then((res) => res.data);

export const getStudentCourses = async () =>
  apiInstanceWithAuth.get("/students-courses").then((res) => res.data);
