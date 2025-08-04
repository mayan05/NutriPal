const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store access token in memory (in production, use proper session management)
let accessToken = null;
let tokenExpiry = null;

// Get IBM Cloud access token
async function getAccessToken() {
  // Check if token is still valid (with 5 minute buffer)
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      new URLSearchParams({
        'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
        'apikey': process.env.IBM_API_KEY
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    // IBM tokens typically expire in 1 hour (3600 seconds)
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    return accessToken;
  } catch (error) {
    console.error('Token error:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    const token = await getAccessToken();

    const response = await axios.post(
      `${process.env.IBM_URL}/ml/v1/text/chat?version=2023-05-29`,
      {
        model_id: process.env.IBM_MODEL_ID,
        project_id: process.env.IBM_PROJECT_ID,
        parameters: {
          temperature: 0.7,
          max_new_tokens: 800,
          top_p: 0.9
        },
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    res.json({
      content: response.data.choices[0].message.content,
      success: true
    });

  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);
    res.status(500).json({
      content: 'Sorry, I encountered an error. Please try again.',
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});