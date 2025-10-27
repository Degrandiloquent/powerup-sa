import axios from 'axios';

// Use environment variable or fallback to localhost
const BASE_URL = 'https://powerup-sa-backend.onrender.com/api';

// Mock data fallback
const mockAreas = [
  { id: 'jhb-sandton', name: 'Johannesburg - Sandton', region: 'Gauteng' },
  { id: 'jhb-soweto', name: 'Johannesburg - Soweto', region: 'Gauteng' },
  { id: 'jhb-rosebank', name: 'Johannesburg - Rosebank', region: 'Gauteng' },
  { id: 'pta-centurion', name: 'Pretoria - Centurion', region: 'Gauteng' },
  { id: 'cpt-cbd', name: 'Cape Town - CBD', region: 'Western Cape' },
  { id: 'cpt-seapoint', name: 'Cape Town - Sea Point', region: 'Western Cape' },
  { id: 'dbn-umhlanga', name: 'Durban - Umhlanga', region: 'KwaZulu-Natal' },
  { id: 'dbn-durban-north', name: 'Durban - Durban North', region: 'KwaZulu-Natal' },
];

export const getCurrentStatus = async () => {
  try {
    console.log('🔍 Fetching current status from backend...');
    const response = await axios.get(`${BASE_URL}/status`);
    console.log('✅ Status response:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('❌ Error fetching status, using fallback:', error.response?.data || error.message);
    return {
      eskom: {
        stage: 4,
        next_stages: [
          { stage: 3, start_timestamp: '2025-10-26T00:00:00' },
          { stage: 2, start_timestamp: '2025-10-26T16:00:00' }
        ]
      }
    };
  }
};

export const searchAreas = async (searchText) => {
  try {
    console.log('🔍 Searching for:', searchText);
    const response = await axios.get(`${BASE_URL}/areas_search`, {
      params: { text: searchText }
    });
    console.log('✅ Search response:', response.data);
    console.log('Number of areas found:', response.data.areas?.length || 0);
    return response.data.areas;
  } catch (error) {
    console.error('❌ Error searching areas (using mock data):', error.response?.status);
    
    const filtered = mockAreas.filter(area =>
      area.name.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log('✅ Using mock data, found:', filtered.length);
    return filtered;
  }
};

export const getAreaSchedule = async (areaId) => {
  try {
    console.log('🔍 Fetching schedule for area:', areaId);
    const response = await axios.get(`${BASE_URL}/area`, {
      params: { id: areaId }
    });
    console.log('✅ Schedule response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching schedule (using mock data):', error.response?.status);
    
    // Generate real dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    return {
      schedule: {
        days: [
          { 
            date: today.toISOString().split('T')[0], 
            stages: [[4, ['16:00-18:30', '20:00-22:30']]] 
          },
          { 
            date: tomorrow.toISOString().split('T')[0], 
            stages: [[3, ['08:00-10:30', '18:00-20:30']]] 
          },
          { 
            date: dayAfter.toISOString().split('T')[0], 
            stages: [[3, ['12:00-14:30', '20:00-22:30']]] 
          }
        ]
      }
    };
  }
};