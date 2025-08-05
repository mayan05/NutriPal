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
      // Create a more detailed prompt that includes specific user profile information
      const prompt = `Create a personalized meal plan for ${selectedDate} specifically tailored to my profile:
      - Health goal: ${userProfile.healthGoal.replace('_', ' ')}
      - Dietary restrictions: ${userProfile.dietaryRestrictions.join(', ') || 'None'}
      - Allergies: ${userProfile.allergies.join(', ') || 'None'}
      - Health conditions: ${userProfile.healthConditions.join(', ') || 'None'}
      - Cultural preferences: ${userProfile.culturalPreferences || 'None specified'}
      - Budget level: ${userProfile.budget}
      
      Please include exactly ${userProfile.mealsPerDay} meals with specific recipes that match my preferences.
      For each meal, provide:
      1. A creative meal name
      2. Meal type (breakfast, lunch, dinner, or snack)
      3. Complete ingredients list with amounts
      4. Step-by-step preparation instructions
      5. Nutritional information (calories, protein, carbs, fat)
      6. Preparation time
      7. Difficulty level
      
      Make sure the meals are varied and appropriate for my activity level (${userProfile.activityLevel.replace('_', ' ')}).
      The total daily nutrition should align with my goal of ${userProfile.healthGoal.replace('_', ' ')}.
      `;
      
      const response = await granite.sendMessage(prompt, userProfile);
      
      // Parse the AI response to create a structured meal plan
      // This is a simplified example - in a production app, you'd want more robust parsing
      try {
        // For demonstration, we'll create a more varied meal plan based on user profile
        // In a real implementation, you would parse the AI response text
        const meals: Meal[] = [];
        
        // Calculate appropriate calorie distribution based on user profile
        let totalCalories = calculateDailyCalories(userProfile);
        let totalProtein = calculateDailyProtein(userProfile);
        let totalCarbs = calculateDailyCarbs(userProfile);
        let totalFat = calculateDailyFat(userProfile);
        
        // Create meals based on user profile and preferences
        for (let i = 0; i < userProfile.mealsPerDay; i++) {
          let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          let mealName: string;
          let ingredients: string[] = [];
          let instructions: string[] = [];
          let caloriesPerMeal = Math.round(totalCalories / userProfile.mealsPerDay);
          let proteinPerMeal = Math.round(totalProtein / userProfile.mealsPerDay);
          let carbsPerMeal = Math.round(totalCarbs / userProfile.mealsPerDay);
          let fatPerMeal = Math.round(totalFat / userProfile.mealsPerDay);
          
          // Assign meal type based on index
          if (i === 0) {
            mealType = 'breakfast';
            
            // Customize breakfast based on dietary restrictions and health goals
            if (userProfile.dietaryRestrictions.includes('vegetarian') || 
                userProfile.dietaryRestrictions.includes('vegan')) {
              mealName = 'Plant-Based Power Breakfast';
              ingredients = ['1 cup plant-based yogurt', '1/2 cup mixed berries', '1/4 cup granola', '1 tbsp chia seeds', '1 tbsp maple syrup'];
              instructions = ['Add yogurt to a bowl', 'Top with berries, granola, and chia seeds', 'Drizzle with maple syrup'];
            } else if (userProfile.healthGoal === 'lose_weight') {
              mealName = 'Low-Calorie Protein Breakfast';
              ingredients = ['3 egg whites', '1/2 cup spinach', '1/4 avocado', '1 slice whole grain toast', 'Salt and pepper to taste'];
              instructions = ['Whisk egg whites with salt and pepper', 'Cook in a non-stick pan with spinach', 'Serve with avocado and toast'];
            } else if (userProfile.healthGoal === 'build_muscle') {
              mealName = 'Muscle Building Breakfast Bowl';
              ingredients = ['1 cup Greek yogurt', '1 scoop protein powder', '1 banana', '2 tbsp peanut butter', '1/4 cup granola'];
              instructions = ['Mix yogurt with protein powder', 'Top with sliced banana', 'Add granola and drizzle with peanut butter'];
            } else {
              mealName = 'Balanced Breakfast Bowl';
              ingredients = ['2 eggs', '1/2 cup sweet potatoes', '1/4 avocado', '1/2 cup spinach', '1 tsp olive oil'];
              instructions = ['Cook sweet potatoes until soft', 'Scramble eggs with spinach', 'Serve with sliced avocado'];
            }
          } else if (i === 1) {
            mealType = 'lunch';
            
            // Customize lunch based on dietary restrictions and health goals
            if (userProfile.dietaryRestrictions.includes('vegetarian') || 
                userProfile.dietaryRestrictions.includes('vegan')) {
              mealName = 'Hearty Plant Protein Bowl';
              ingredients = ['1 cup quinoa', '1 cup roasted vegetables', '1/2 cup chickpeas', '1/4 cup hummus', '1 tbsp tahini dressing'];
              instructions = ['Cook quinoa according to package instructions', 'Roast vegetables with olive oil', 'Combine all ingredients in a bowl', 'Drizzle with tahini dressing'];
            } else if (userProfile.healthGoal === 'lose_weight') {
              mealName = 'Light Protein Salad';
              ingredients = ['4 oz grilled chicken breast', '2 cups mixed greens', '1/4 cup cherry tomatoes', '1/4 cucumber', '1 tbsp light vinaigrette'];
              instructions = ['Grill chicken breast', 'Chop vegetables', 'Combine all ingredients', 'Dress with vinaigrette'];
            } else {
              mealName = 'Energy-Boosting Grain Bowl';
              ingredients = ['4 oz lean protein (chicken/fish/tofu)', '1 cup brown rice', '1 cup roasted vegetables', '1/4 avocado', '2 tbsp sauce of choice'];
              instructions = ['Cook rice according to package', 'Prepare protein', 'Roast vegetables', 'Combine in a bowl and top with sauce'];
            }
          } else {
            mealType = i === 2 ? 'dinner' : 'snack';
            
            // Customize dinner/snack based on dietary restrictions and health goals
            if (mealType === 'dinner') {
              if (userProfile.dietaryRestrictions.includes('vegetarian') || 
                  userProfile.dietaryRestrictions.includes('vegan')) {
                mealName = 'Protein-Packed Plant Dinner';
                ingredients = ['1 cup lentil pasta', '1 cup vegetable sauce', '2 tbsp nutritional yeast', '1 cup steamed broccoli', '1 tbsp olive oil'];
                instructions = ['Cook pasta according to package', 'Heat sauce in a pan', 'Combine pasta and sauce', 'Top with nutritional yeast and serve with broccoli'];
              } else if (userProfile.healthGoal === 'lose_weight') {
                mealName = 'Light Evening Protein Plate';
                ingredients = ['4 oz baked fish', '1 cup cauliflower rice', '1 cup roasted vegetables', '1 tbsp light sauce', 'Fresh herbs'];
                instructions = ['Bake fish with herbs and lemon', 'Prepare cauliflower rice', 'Roast vegetables', 'Plate all components and drizzle with sauce'];
              } else {
                mealName = 'Complete Protein Dinner';
                ingredients = ['5 oz protein (chicken/fish/beef/tofu)', '1 cup complex carbs (sweet potato/quinoa/rice)', '2 cups vegetables', '1 tbsp healthy fat', 'Herbs and spices'];
                instructions = ['Prepare protein with herbs and spices', 'Cook carbs', 'Steam or roast vegetables', 'Combine on plate with healthy fat'];
              }
            } else { // snack
              if (userProfile.healthGoal === 'lose_weight') {
                mealName = 'Light Protein Snack';
                ingredients = ['1 apple', '1 tbsp almond butter'];
                instructions = ['Slice apple', 'Serve with almond butter for dipping'];
                caloriesPerMeal = Math.round(caloriesPerMeal * 0.5); // Smaller snack
                proteinPerMeal = Math.round(proteinPerMeal * 0.5);
                carbsPerMeal = Math.round(carbsPerMeal * 0.5);
                fatPerMeal = Math.round(fatPerMeal * 0.5);
              } else if (userProfile.healthGoal === 'build_muscle') {
                mealName = 'Muscle Recovery Snack';
                ingredients = ['1 protein shake (1 scoop protein powder, 1 cup milk)', '1 banana'];
                instructions = ['Blend protein powder with milk', 'Enjoy with a banana'];
              } else {
                mealName = 'Balanced Energy Snack';
                ingredients = ['1/4 cup mixed nuts', '1/4 cup dried fruit'];
                instructions = ['Mix nuts and dried fruit', 'Portion into a small container'];
                caloriesPerMeal = Math.round(caloriesPerMeal * 0.7); // Smaller snack
                proteinPerMeal = Math.round(proteinPerMeal * 0.7);
                carbsPerMeal = Math.round(carbsPerMeal * 0.7);
                fatPerMeal = Math.round(fatPerMeal * 0.7);
              }
            }
          }
          
          // Add the meal to our plan
          meals.push({
            id: (i + 1).toString(),
            name: mealName,
            type: mealType,
            ingredients: ingredients,
            instructions: instructions,
            nutrition: { 
              calories: caloriesPerMeal, 
              protein: proteinPerMeal, 
              carbs: carbsPerMeal, 
              fat: fatPerMeal, 
              fiber: Math.round(caloriesPerMeal * 0.015) // Approximate fiber
            },
            prepTime: mealType === 'snack' ? 5 : 20,
            difficulty: mealType === 'snack' ? 'easy' : 'medium'
          });
        }
        
        // Create the complete meal plan
        const personalizedMealPlan: DayMealPlan = {
          date: new Date(selectedDate),
          meals: meals,
          totalNutrition: {
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat,
            fiber: Math.round(totalCalories * 0.015) // Approximate fiber based on calories
          }
        };
        
        setMealPlan(personalizedMealPlan);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback to a basic meal plan if parsing fails
        const basicMeal: Meal = {
          id: '1',
          name: 'Basic Healthy Meal',
          type: 'breakfast',
          ingredients: ['Protein source', 'Complex carbs', 'Vegetables', 'Healthy fat'],
          instructions: ['Prepare all ingredients', 'Combine and serve'],
          nutrition: { calories: 400, protein: 25, carbs: 40, fat: 15, fiber: 6 },
          prepTime: 15,
          difficulty: 'easy'
        };
        
        setMealPlan({
          date: new Date(selectedDate),
          meals: [basicMeal],
          totalNutrition: { calories: 1600, protein: 100, carbs: 160, fat: 60, fiber: 24 }
        });
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper functions to calculate nutrition based on user profile
  const calculateDailyCalories = (profile: UserProfile): number => {
    // Basic BMR calculation using Harris-Benedict equation
    let bmr = 0;
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }
    
    // Activity multiplier
    let activityMultiplier = 1.2; // sedentary
    if (profile.activityLevel === 'lightly_active') activityMultiplier = 1.375;
    else if (profile.activityLevel === 'moderately_active') activityMultiplier = 1.55;
    else if (profile.activityLevel === 'very_active') activityMultiplier = 1.725;
    else if (profile.activityLevel === 'extremely_active') activityMultiplier = 1.9;
    
    let calories = Math.round(bmr * activityMultiplier);
    
    // Adjust based on goal
    if (profile.healthGoal === 'lose_weight') calories -= 500;
    else if (profile.healthGoal === 'gain_weight') calories += 500;
    else if (profile.healthGoal === 'build_muscle') calories += 300;
    
    return calories;
  };
  
  const calculateDailyProtein = (profile: UserProfile): number => {
    let proteinMultiplier = 0.8; // grams per kg of bodyweight (RDA)
    
    if (profile.healthGoal === 'build_muscle') proteinMultiplier = 2.0;
    else if (profile.healthGoal === 'lose_weight') proteinMultiplier = 1.6;
    else if (profile.activityLevel === 'very_active' || profile.activityLevel === 'extremely_active') {
      proteinMultiplier = 1.4;
    }
    
    return Math.round(profile.weight * proteinMultiplier);
  };
  
  const calculateDailyCarbs = (profile: UserProfile): number => {
    const calories = calculateDailyCalories(profile);
    let carbPercentage = 0.5; // 50% of calories from carbs by default
    
    if (profile.healthGoal === 'lose_weight') carbPercentage = 0.4;
    else if (profile.healthGoal === 'build_muscle') carbPercentage = 0.55;
    
    return Math.round((calories * carbPercentage) / 4); // 4 calories per gram of carbs
  };
  
  const calculateDailyFat = (profile: UserProfile): number => {
    const calories = calculateDailyCalories(profile);
    let fatPercentage = 0.3; // 30% of calories from fat by default
    
    if (profile.healthGoal === 'lose_weight') fatPercentage = 0.35;
    
    return Math.round((calories * fatPercentage) / 9); // 9 calories per gram of fat
  };

  return (
    <div className="meal-plan-container">
      <div className="meal-plan-header">
        <button onClick={onBack} className="back-btn">← Back to Chat</button>
        <h2>🍽️ Your Meal Plan</h2>
      </div>

      <div className="date-selector">
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