# NutriPal - AI Nutrition Assistant

A smart, personalized nutrition assistant powered by IBM Granite AI that provides customized meal plans, nutrition advice, and healthy eating guidance.

## Features

- **Personalized User Profiles**: Complete health and dietary preference profiling
- **AI-Powered Chat Interface**: Natural conversation with IBM Granite AI model
- **Custom Meal Planning**: Generate personalized meal plans based on your goals
- **Nutrition Guidance**: Get expert advice on healthy eating habits
- **Cultural Preferences**: Support for diverse cultural and regional food preferences
- **Dietary Restrictions**: Accommodates allergies, medical conditions, and dietary choices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **AI Model**: IBM Granite (via IBM Watson Machine Learning)
- **Styling**: Custom CSS with modern design
- **HTTP Client**: Axios for API communication

## Live Demo

Check out the live application:
- Frontend: https://nutri-pal-one.vercel.app/
- Backend API: https://nutripal-bqg1.onrender.com

## Deployment

### Backend
The backend is deployed on Render's free tier service:
- The Express server handles API requests and communicates with IBM Watson services
- Environment variables are configured on Render for IBM API credentials

### Frontend
The React frontend is deployed on Vercel:
- Connected to the GitHub repository for continuous deployment
- Environment variables configured to point to the Render backend


## Project Structure

```
src/
├── components/
│   ├── UserProfile.tsx      # User profile setup form
│   ├── ChatInterface.tsx    # Main chat interface
│   └── MealPlan.tsx        # Meal planning component
├── services/
│   └── graniteAPI.ts       # IBM Granite API integration
├── types/
│   └── index.ts            # TypeScript type definitions
├── styles/
│   └── App.css            # Application styles
└── App.tsx                # Main application component
```

## Usage

1. **Profile Setup**: Complete your health profile with dietary preferences, goals, and restrictions
2. **Chat Interface**: Ask questions about nutrition, meal planning, and healthy eating
3. **Meal Planning**: Generate personalized meal plans for specific dates
4. **Quick Questions**: Use preset questions for common nutrition queries

## Features in Detail

### User Profile
- Basic information (age, gender, height, weight)
- Activity level and health goals
- Dietary restrictions and allergies
- Cultural food preferences
- Budget considerations

### AI Chat Assistant
- Natural language conversation
- Personalized responses based on your profile
- Nutrition advice and explanations
- Food recommendations and substitutions

### Meal Planning
- Date-specific meal plans
- Detailed recipes with ingredients
- Nutritional information
- Preparation time and difficulty level

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit the PR

## License

This project is licensed under the MIT License.

## Acknowledgments

- IBM Watson Machine Learning for AI capabilities
- IBM Granite model for natural language processing