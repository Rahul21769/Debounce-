import axios from 'axios';

const API_KEY = 'Wc7p2mQsE2IQCzbeBi0nuAI0kr1jCSuYyroEkgaUnEkgOMsCapMLObX2'; // Replace with your Pexels API Key
const BASE_URL = 'https://api.pexels.com/v1';

// Function to fetch photos with pagination
export const searchPhotos = async (query, page = 1, perPage = 15, orientation = '') => {
  const imageParams = {
    query,
    per_page: perPage,
    page,
  };

  if (orientation) {
    if (orientation === 'Horizontal') {
      imageParams.orientation = 'landscape';
    }
    if (orientation === 'Vertical') {
      imageParams.orientation = 'portrait';
    }
  }


  const response = await axios.get(`${BASE_URL}/search`, {
    headers: {
      Authorization: API_KEY,
    },
    params: imageParams
  });
  return response.data.photos;
};

// Function to fetch videos with pagination
export const searchVideos = async (query, page = 1, perPage = 5, orientation = '') => {
  const videosParams = {
    query,
    per_page: perPage,
    page,
  };

  if (orientation) {
    if (orientation === 'Horizontal') {
      videosParams.orientation = 'landscape';
    }
    if (orientation === 'Vertical') {
      videosParams.orientation = 'portrait';
    }
  }

  const response = await axios.get(`${BASE_URL}/videos/search`, {
    headers: {
      Authorization: API_KEY,
    },
    params: videosParams
  });
  return response.data.videos;
};
