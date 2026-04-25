import axios from "axios";

const BASE_URL = "http://localhost:8080/api/resources";
const UPLOAD_URL = "http://localhost:8080/api/upload";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getResources = () => axios.get(BASE_URL);
export const createResource = (data) => axios.post(BASE_URL, data, authHeader());
export const deleteResource = (id) => axios.delete(`${BASE_URL}/${id}`, authHeader());
export const updateResource = (id, data) => axios.put(`${BASE_URL}/${id}`, data, authHeader());

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(UPLOAD_URL, formData, authHeader());
};

