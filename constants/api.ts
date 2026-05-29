// constants/api.ts
// URL central del backend — si cambia el servidor, solo editar aquí

export const BASE_URL = 'https://backsweet.onrender.com/api';

export const API_ROUTES = {
  // ── Auth ─────────────────────────────────────────────────────
  auth: {
    login:    `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    me:       `${BASE_URL}/auth/me`,
  },

  // ── Recetas ──────────────────────────────────────────────────
  recipes: {
    getAll:          `${BASE_URL}/recipes`,
    getByCategory:   (categoryId: number | string) => `${BASE_URL}/recipes?categoryId=${categoryId}`,
    getOne:          (id: number | string) => `${BASE_URL}/recipes/${id}`,
    create:          `${BASE_URL}/recipes`,
    fromSpoonacular: `${BASE_URL}/recipes/from-spoonacular`,
  },

  // ── Categorías ───────────────────────────────────────────────
  categories: {
    getAll: `${BASE_URL}/categories`,
  },

  // ── Favoritos ────────────────────────────────────────────────
  favorites: {
    getAll: `${BASE_URL}/favorites`,
    create: `${BASE_URL}/favorites`,
    delete: (recipeId: number | string) => `${BASE_URL}/favorites/${recipeId}`,
  },

  // ── Spoonacular (via backend, no directo) ────────────────────
  spoonacular: {
    search: (query: string) =>
      `${BASE_URL}/spoonacular/search?q=${encodeURIComponent(query)}`,
    detail: (id: number | string) => `${BASE_URL}/spoonacular/detail/${id}`,
  },
};