import axios from 'axios';
import { UserProfile, NutritionResponse } from '../types/index';

class GraniteAPI {
  private backendUrl: string;

  constructor() {
    // Point to your backend server
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  }

  private getSystemPrompt(): string {
    return `You are an expert AI Nutrition Assistant. Your role is to provide personalized, science-based nutrition guidance. 

Key responsibilities:
- Create personalized meal plans based on health goals, dietary restrictions, and preferences
- Explain nutritional benefits and reasoning behind recommendations
- Suggest healthy food swaps and alternatives
- Consider cultural preferences, allergies, and medical conditions
- Provide portion sizes and calorie estimates when relevant
- Always recommend consulting healthcare professionals for serious medical conditions

Response style:
- Be friendly, encouraging, and supportive
- Use simple, easy-to-understand language
- Provide actionable, practical advice
- Include variety and balance in recommendations
- Focus on sustainable, long-term healthy habits`;
  }

  private createUserContext(userProfile: UserProfile): string {
    return `User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age} years old
- Gender: ${userProfile.gender}
- Location: ${userProfile.location}
- Height: ${userProfile.height}cm, Weight: ${userProfile.weight}kg
- Activity Level: ${userProfile.activityLevel.replace('_', ' ')}
- Health Goal: ${userProfile.healthGoal.replace('_', ' ')}
- Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ') || 'None'}
- Allergies: ${userProfile.allergies.join(', ') || 'None'}
- Health Conditions: ${userProfile.healthConditions.join(', ') || 'None'}
- Cultural Preferences: ${userProfile.culturalPreferences || 'None specified'}
- Preferred Meals Per Day: ${userProfile.mealsPerDay}
- Budget: ${userProfile.budget}

Please provide personalized nutrition advice based on this profile.`;
  }

  async sendMessage(userMessage: string, userProfile?: UserProfile): Promise<NutritionResponse> {
    try {
      const messages = [
        {
          role: 'system',
          content: this.getSystemPrompt()
        }
      ];

      if (userProfile) {
        messages.push({
          role: 'system',  
          content: this.createUserContext(userProfile)
        });
      }

      messages.push({
        role: 'user',
        content: userMessage
      });

      // Call your backend instead of IBM Cloud directly
      const response = await axios.post(
        `${this.backendUrl}/api/chat`,
        {
          messages,
          userProfile
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;

    } catch (error: any) {
      console.error('Backend API Error:', error);
      return {
        content: 'Sorry, I encountered an error. Please try again.',
        success: false,
        error: error.message
      };
    }
  }
}

export const granite = new GraniteAPI();