import { apiInstanceWithAuth } from "../utils/axios";

export const getOverviews = async () =>
  apiInstanceWithAuth.get("/overview").then((res) => res.data);