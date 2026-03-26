// src/types/recetas.types.ts raiz

// Tipo para una receta individual
export interface Receta {
  id?: number;           
  title: string;        
  image: string;         
  ingredientes?: string[];  
  preparacion?: string;     
  tiempo?: number;          
}

// Tipo para el objeto de imágenes (el que tienes en tu componente)
export interface ImagenesRecetas {
  [key: string]: any;    // Para acceder con images[title as string]
}

// Tipo para el array de favoritos que guardas en AsyncStorage
export interface FavoritoItem {
  title: string;
  image: string;
}

// Tipo para la respuesta de la API (para cuando conectes con tu JSON)
export interface RecetasApiResponse {
  recetas: Receta[];
  total?: number;
}