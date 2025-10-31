import { apiInstanceWithAuth } from "../utils/axios";

export const getCourses = async () => apiInstanceWithAuth.get("/courses").then(res => res.data);

export const getCategories = async () => apiInstanceWithAuth.get("/categories").then(res => res.data);