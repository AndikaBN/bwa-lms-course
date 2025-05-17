import apiInstance from "../utils/axios";

export const postSignUp = async (data) => apiInstance.post("/sign-up", data).then((res) => res.data);