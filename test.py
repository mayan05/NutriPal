import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# IBM Watson credentials
PROJECT_ID = os.getenv("PROJECT_ID")
MODEL_ID = os.getenv("MODEL_ID")
API_KEY = os.getenv("API_KEY")
URL = os.getenv("URL")

def get_access_token():
    """Get IBM Cloud access token"""
    token_url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": API_KEY
    }
    
    response = requests.post(token_url, headers=headers, data=data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception(f"Failed to get access token: {response.text}")

def test_granite_nutrition(user_message):
    """Test Granite model with nutrition question"""
    
    # System prompt for nutrition assistant
    system_prompt = """You are an expert AI Nutrition Assistant. Your role is to provide personalized, science-based nutrition guidance. 

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
- Focus on sustainable, long-term healthy habits"""

    try:
        # Get access token
        access_token = get_access_token()
        
        # Prepare the request
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Request payload with system prompt and temperature
        payload = {
            "model_id": MODEL_ID,
            "project_id": PROJECT_ID,
            "parameters": {
                "temperature": 0.7,
                "max_new_tokens": 500,
                "top_p": 0.9
            },
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user", 
                    "content": user_message
                }
            ]
        }
        
        # Make the request
        response = requests.post(
            f"{URL}/ml/v1/text/chat?version=2023-05-29",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            return f"Error: {response.status_code} - {response.text}"
            
    except Exception as e:
        return f"Exception occurred: {str(e)}"

# Test the nutrition assistant
if __name__ == "__main__":
    print("🥗 Testing IBM Granite Nutrition Assistant...")
    print("=" * 50)
    
    # Test questions
    test_questions = [
        "Create a healthy breakfast meal plan for someone with diabetes who wants to lose weight",
        "I'm vegetarian and need high-protein lunch ideas. I'm also allergic to nuts.",
        "What are some healthy snacks under 200 calories?",
        "Suggest a weekly meal prep plan for a busy professional who wants to build muscle"
    ]
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n🔸 Test {i}: {question}")
        print("-" * 50)
        
        response = test_granite_nutrition(question)
        print(response)
        print("\n" + "="*50)
    
    print("\n✅ Testing completed!")
    print("\nIf you see good nutrition responses above, your setup is working perfectly!")