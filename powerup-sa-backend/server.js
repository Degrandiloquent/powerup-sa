const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow both local and production frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://powerup-sa.vercel.app',
    /\.vercel\.app$/  // Allow all Vercel preview deployments
  ]
}));
app.use(express.json());

// Rest of your server.js code stays the same...
const ESKOM_API_BASE = 'https://developer.sepush.co.za/business/2.0';
const ESKOM_API_KEY = process.env.ESKOM_API_KEY;

const eskomAPI = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${ESKOM_API_BASE}${endpoint}`, {
      headers: {
        'token': ESKOM_API_KEY
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

app.get('/api/status', async (req, res) => {
  try {
    console.log('📊 Fetching current status...');
    const data = await eskomAPI('/status');
    console.log('✅ Status fetched successfully');
    res.json(data);
  } catch (error) {
    console.error('❌ Status error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch status',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/api/areas_search', async (req, res) => {
  try {
    const { text } = req.query;
    console.log(`🔍 Searching for: ${text}`);
    
    if (!text || text.length < 3) {
      return res.status(400).json({ error: 'Search text must be at least 3 characters' });
    }

    const data = await eskomAPI('/areas_search', { text });
    console.log(`✅ Found ${data.areas?.length || 0} areas`);
    res.json(data);
  } catch (error) {
    console.error('❌ Search error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to search areas',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/api/area', async (req, res) => {
  try {
    const { id } = req.query;
    console.log(`📅 Fetching schedule for area: ${id}`);
    
    if (!id) {
      return res.status(400).json({ error: 'Area ID is required' });
    }

    const data = await eskomAPI('/area', { id });
    console.log('✅ Schedule fetched successfully');
    res.json(data);
  } catch (error) {
    console.error('❌ Schedule error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch area schedule',
      details: error.response?.data || error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PowerUp SA Backend is running',
    apiKeyConfigured: !!ESKOM_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🔑 API Key configured: ${ESKOM_API_KEY ? 'YES' : 'NO'}`);
  console.log(`📡 CORS enabled for production`);
});