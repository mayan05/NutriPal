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
- **AI Model**: IBM Granite (via IBM Watson Machine Learning)
- **Styling**: Custom CSS with modern design
- **HTTP Client**: Axios for API communication

## Setup Instructions

### Prerequisites

1. IBM Cloud account with Watson Machine Learning service
2. Node.js (v16 or higher)
3. npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nutripal-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your IBM credentials:
```bash
REACT_APP_API_KEY=your_ibm_api_key_here
REACT_APP_URL=https://us-south.ml.cloud.ibm.com
REACT_APP_PROJECT_ID=your_project_id_here
REACT_APP_MODEL_ID=ibm/granite-13b-chat-v2
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Getting IBM Credentials

### Step 1: Create IBM Cloud Account
1. Go to [IBM Cloud](https://cloud.ibm.com)
2. Sign up for a free account

### Step 2: Create Watson Machine Learning Service
1. From IBM Cloud dashboard, click "Create resource"
2. Search for "Watson Machine Learning"
3. Select the Lite plan (free)
4. Create the service

### Step 3: Get API Key
1. Go to IBM Cloud dashboard → Resource list
2. Find your Watson ML service
3. Click on it → Service credentials
4. Create new credentials if none exist
5. Copy the `apikey` value

### Step 4: Create Project and Deploy Model
1. Go to [IBM Watson Studio](https://dataplatform.cloud.ibm.com)
2. Create a new project
3. Go to Assets → Foundation models
4. Select IBM Granite model
5. Deploy the model
6. Copy the project ID from project settings

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
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the GitHub repository or contact the development team.

## Acknowledgments

- IBM Watson Machine Learning for AI capabilities
- IBM Granite model for natural language processing
- React community for excellent documentation and tools