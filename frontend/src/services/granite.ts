import axios from 'axios';
import { UserProfile, NutritionResponse } from '../types/index';

class GraniteAPI {
  private apiKey: string;
  private url: string;
  private projectId: string;
  private modelId: string;
  private accessToken: string | null = null;

  constructor() {
    this.apiKey = process.env.REACT_APP_API_KEY || '';
    this.url = process.env.REACT_APP_URL || '';
    this.projectId = process.env.REACT_APP_PROJECT_ID || '';
    this.modelId = process.env.REACT_APP_MODEL_ID || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://iam.cloud.ibm.com/identity/token',
        new URLSearchParams({
          'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
          'apikey': this.apiKey
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      if (!this.accessToken) {
        throw new Error('No access token received');
      }
      return this.accessToken;
    } catch (error) {
      console.error('Token error:', error);
      throw new Error('Failed to get access token');
    }
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
      const accessToken = await this.getAccessToken();

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

      const response = await axios.post(
        `${this.url}/ml/v1/text/chat?version=2023-05-29`,
        {
          model_id: this.modelId,
          project_id: this.projectId,
          parameters: {
            temperature: 0.7,
            max_new_tokens: 800,
            top_p: 0.9
          },
          messages
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      return {
        content: response.data.choices[0].message.content,
        success: true
      };

    } catch (error: any) {
      console.error('Granite API Error:', error);
      return {
        content: 'Sorry, I encountered an error. Please try again.',
        success: false,
        error: error.message
      };
    }
  }
}

export const granite = new GraniteAPI();