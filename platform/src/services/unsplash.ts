// src/lib/services/unsplash.ts
import axios from 'axios';

const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

export async function searchUnsplashPhotos(query: string, page: number = 1, perPage: number = 20) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
    },
  });

  return response.data;
}

export async function getRandomUnsplashPhotos(count: number = 20) {
  const url = `https://api.unsplash.com/photos/random?count=${count}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
    },
  });

  return response.data;
}
