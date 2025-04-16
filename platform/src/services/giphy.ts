// src/lib/services/giphy.ts
import axios from 'axios';

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

export async function searchGiphy(query: string, limit: number = 20, offset: number = 0) {
  const url = `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(query)}&api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}`;

  const response = await axios.get(url);

  return response.data;
}

export async function getTrendingGiphy(limit: number = 20) {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}`;

  const response = await axios.get(url);

  return response.data;
}

export async function getGiphyCategories() {
  const url = `https://api.giphy.com/v1/gifs/categories?api_key=${GIPHY_API_KEY}`;

  const response = await axios.get(url);

  return response.data;
}
