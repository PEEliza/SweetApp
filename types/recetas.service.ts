//types/recetas.service.ts
export interface Receta {
  id: string;
  title: string;
  image: string;
  categoria?: string;
}

//interfaz de detalle
export interface RecetaDetalle {
  id: string;
  title: string;
  image: string;
  ingredientes: string[];
  preparacion: string;
  categoria?: string;
}


//api link
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const obtenerRecetas = async (categoria: string = 'Dessert'): Promise<Receta[]> => {
  try {
    console.log(`🍰 Obteniendo recetas de categoría: ${categoria}`);
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${categoria}`);
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.meals) return [];
    
    return data.meals.map((meal: any) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      categoria: categoria
    }));
    
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
};

// Función para buscar por nombre 
export const buscarRecetas = async (query: string = 'cake'): Promise<Receta[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    
    if (!data.meals) return [];
    
    return data.meals.map((meal: any) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};
export const obtenerDetalleReceta = async (idMeal: string): Promise<RecetaDetalle | null> => {
  try {
    console.log(`🔍 Obteniendo detalle para ID: ${idMeal}`);
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${idMeal}`);
    const data = await response.json();
    
    if (data.meals && data.meals[0]) {
      const meal = data.meals[0];
      
      // Procesar ingredientes 
      const ingredientes = [];
      for (let i = 1; i <= 20; i++) {
        const ingrediente = meal[`strIngredient${i}`];
        const medida = meal[`strMeasure${i}`];
        
        // Solo agregar si hay ingrediente y no está vacío
        if (ingrediente && ingrediente.trim() !== '') {
          ingredientes.push(`${ingrediente} - ${medida}`);
        }
      }
      
      console.log(`✅ Detalle cargado para: ${meal.strMeal}`);
      return {
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        ingredientes: ingredientes,
        preparacion: meal.strInstructions || 'Instrucciones no disponibles',
        categoria: meal.strCategory
      };
    }
    
    console.log('⚠️ No se encontró la receta');
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo detalle:', error);
    return null;
  }
};