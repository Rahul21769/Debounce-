import axios from 'axios';

const API_KEY = 'Wc7p2mQsE2IQCzbeBi0nuAI0kr1jCSuYyroEkgaUnEkgOMsCapMLObX2'; // Replace with your Pexels API Key
const BASE_URL = 'https://api.pexels.com/v1';

// Function to fetch photos with pagination
export const searchPhotos = async (query, page = 1, perPage = 15) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    headers: {
      Authorization: API_KEY,
    },
    params: {
      query,
      per_page: perPage,
      page,
    },
  });
  return response.data.photos;
};

// Function to fetch videos with pagination
export const searchVideos = async (query, page = 1, perPage = 5) => {
  const response = await axios.get(`${BASE_URL}/videos/search`, {
    headers: {
      Authorization: API_KEY,
    },
    params: {
      query,
      per_page: perPage,
      page,
    },
  });
  return response.data.videos;
};
