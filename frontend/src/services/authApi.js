import axios from "axios";

const API = axios.create({
  baseURL: "https://rest-countries-app-backend.vercel.app/api",
  withCredentials: true,
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  register: async (data) => {
    const response = await API.post("/auth/register", data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },
  
  login: async (data) => {
    const response = await API.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    return API.post("/auth/logout");
  },
  
  me: () => {
    return API.get("/auth/me");
  },

  checkAuthStatus: () => {
    return localStorage.getItem('authToken') ? true : false;
  }
};

export const favoritesApi = {
  get: () => API.get("/favorites"),
  add: (countryCode) => API.post("/favorites/add", { countryCode }),
  remove: (countryCode) => API.post("/favorites/remove", { countryCode }),
};
