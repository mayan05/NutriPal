import React, { useState, useEffect } from 'react';
import { UserProfile, DayMealPlan, Meal } from '../types/index';
import { granite } from '../services/granite';

interface MealPlanProps {
  userProfile: UserProfile;
  onBack: () => void;
}

const MealPlan: React.FC<MealPlanProps> = ({ userProfile, onBack }) => {
  const [mealPlan, setMealPlan] = useState<DayMealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const generateMealPlan = async () => {
    setIsLoading(true);
    try {
      const prompt = `Create a detailed meal plan for ${selectedDate} based on my profile. Include ${userProfile.mealsPerDay} meals with specific recipes, ingredients, and nutritional information. Format the response with clear meal names, ingredients lists, and preparation instructions.`;
      
      const response = await granite.sendMessage(prompt, userProfile);
      
      // For now, we'll create a mock meal plan structure
      // In a real app, you'd parse the AI response more sophisticatedly
      const mockMealPlan: DayMealPlan = {
        date: new Date(selectedDate),
        meals: [
          {
            id: '1',
            name: 'Healthy Breakfast',
            type: 'breakfast',
            ingredients: ['Oats', 'Banana', 'Almonds', 'Milk'],
            instructions: ['Mix oats with milk', 'Add sliced banana', 'Top with almonds'],
            nutrition: { calories: 350, protein: 12, carbs: 45, fat: 8, fiber: 6 },
            prepTime: 10,
            difficulty: 'easy'
          }
        ],
        totalNutrition: { calories: 1800, protein: 120, carbs: 200, fat: 60, fiber: 25 }
      };
      
      setMealPlan(mockMealPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="meal-plan-container">
      <div className="meal-plan-header">
        <button onClick={onBack} className="back-btn">← Back to Chat</button>
        <h2>🍽️ Your Meal Plan</h2>
      </div>

      <div className="date-selector">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={generateMealPlan} disabled={isLoading} className="generate-btn">
          {isLoading ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Creating your personalized meal plan...</p>
        </div>
      )}

      {mealPlan && !isLoading && (
        <div className="meal-plan-content">
          <div className="nutrition-summary">
            <h3>Daily Nutrition Summary</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="label">Calories:</span>
                <span className="value">{mealPlan.totalNutrition.calories}</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Protein:</span>
                <span className="value">{mealPlan.totalNutrition.protein}g</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Carbs:</span>
                <span className="value">{mealPlan.totalNutrition.carbs}g</span>
              </div>
              <div className="nutrition-item">
                <span className="label">Fat:</span>
                <span className="value">{mealPlan.totalNutrition.fat}g</span>
              </div>
            </div>
          </div>

          <div className="meals-list">
            {mealPlan.meals.map((meal) => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <h4>{meal.name}</h4>
                  <span className={`meal-type ${meal.type}`}>{meal.type}</span>
                </div>
                
                <div className="meal-details">
                  <div className="meal-info">
                    <span>⏱️ {meal.prepTime} min</span>
                    <span className={`difficulty ${meal.difficulty}`}>
                      {meal.difficulty}
                    </span>
                  </div>
                  
                  <div className="ingredients">
                    <h5>Ingredients:</h5>
                    <ul>
                      {meal.ingredients.map((ingredient: string, index: number) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="instructions">
                    <h5>Instructions:</h5>
                    <ol>
                      {meal.instructions.map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="meal-nutrition">
                    <span>{meal.nutrition.calories} cal</span>
                    <span>{meal.nutrition.protein}g protein</span>
                    <span>{meal.nutrition.carbs}g carbs</span>
                    <span>{meal.nutrition.fat}g fat</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;