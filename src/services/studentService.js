import { apiInstanceWithAuth } from "../utils/axios";

export const getStudents = async () =>
  apiInstanceWithAuth.get("students").then((res) => res.data);

