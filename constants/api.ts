// constants/api.ts

// 1. Jalamos la URL que lee tu archivo .env automáticamente
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const API_ROUTES = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
  },
  recipes: {
    getAll: `${BASE_URL}/recipes`,
    getOne: (id: number | string) => `${BASE_URL}/recipes/${id}`,
    favorites: `${BASE_URL}/favorites`,
  },
  categories: {
    getAll: `${BASE_URL}/categories`,
  }
};

export default BASE_URL;