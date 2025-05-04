import axios from "axios";

const API = axios.create({
  baseURL: "https://rest-countries-app-backend.vercel.app/api",
  withCredentials: true,
});

export const authApi = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  logout: () => API.post("/auth/logout"),
  me: () => API.get("/auth/me"),
};

export const favoritesApi = {
  get: () => API.get("/favorites"),
  add: (countryCode) => API.post("/favorites/add", { countryCode }),
  remove: (countryCode) => API.post("/favorites/remove", { countryCode }),
};
