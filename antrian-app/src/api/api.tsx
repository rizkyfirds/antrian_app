import axios from "axios";

export interface createDataInterface {
  name: string;
  email: string;
  phone: string;
}

interface loginForm {
  username: string;
  password: string;
}

const API_BASE_URL = "http://localhost:5000/api";

export const getAntrian = async (page = 1, limit = 10) => {
  return axios.get(`${API_BASE_URL}/antrian?page=${page}&limit=${limit}`);
};

export const createAntrian = (data: createDataInterface) =>
  axios.post(`${API_BASE_URL}/antrian`, data);

export const updateStatusAntrian = (id: string, status: string) =>
  axios.patch(`${API_BASE_URL}/antrian/${id}/status`, { status });

export const getLastQueue = () =>
  axios.get(`${API_BASE_URL}/antrian/lastQueue`);

export const getCurrentQueue = () =>
  axios.get(`${API_BASE_URL}/antrian/currentQueue`);

export const login = (data: loginForm) =>
  axios.post(`${API_BASE_URL}/antrian/login`, data);
