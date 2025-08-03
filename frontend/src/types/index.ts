// User Profile Types
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  healthGoal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | 'improve_health';
  dietaryRestrictions: string[];
  allergies: string[];
  healthConditions: string[];
  culturalPreferences: string;
  mealsPerDay: number;
  budget: 'low' | 'medium' | 'high';
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// API Response Types
export interface NutritionResponse {
  content: string;
  success: boolean;
  error?: string;
}

// Meal Plan Types
export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  prepTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DayMealPlan {
  date: Date;
  meals: Meal[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface WeeklyMealPlan {
  weekOf: Date;
  days: DayMealPlan[];
  shoppingList: string[];
}