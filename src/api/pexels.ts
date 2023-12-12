import axios from 'axios';
import * as AxiosLogger from 'axios-logger';
import {API_KEY} from '@env';
import {PhotoResponse} from '../types';
import {setGlobalConfig} from 'axios-logger';
import axiosRetry, {exponentialDelay} from 'axios-retry';

const BASE_URL = 'https://api.pexels.com/v1';

export const DEFAULT_PER_PAGE = 15;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: API_KEY,
  },
});

setGlobalConfig({
  headers: true,
  params: true,
});

instance.interceptors.request.use(AxiosLogger.requestLogger);
axiosRetry(instance, {retryDelay: exponentialDelay, retries: 3});

export async function fetchCuratedPhotos(page: number): Promise<PhotoResponse> {
  try {
    const response = await instance.get('/curated', {
      params: {
        page,
      },
    });

    const photos: PhotoResponse = response.data;

    return photos;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
