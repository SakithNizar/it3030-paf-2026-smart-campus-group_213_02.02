import axios from "axios";

const BASE_URL = "http://localhost:8080/api/resources";

export const getResources = () => axios.get(BASE_URL);
export const createResource = (data) => axios.post(BASE_URL, data);
export const deleteResource = (id) => axios.delete(`${BASE_URL}/${id}`);
export const updateResource = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);

