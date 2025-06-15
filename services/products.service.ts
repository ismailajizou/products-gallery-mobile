import type { Product } from '@/types/products';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

const PRODUCTS_CACHE_KEY = 'cached_products';
const CACHE_EXPIRY_KEY = 'products_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedProducts {
  data: Product[];
  timestamp: number;
}

export const getAll = async (): Promise<Product[]> => {
  try {
    // Try to fetch fresh data from API
    const response = await api.get<Product[]>('/products');
    const products = response.data;

    // Cache the fresh data
    await cacheProducts(products);

    return products;
  } catch (error) {
    console.log('API failed, trying cached data:', error);

    // If API fails, try to get cached data
    const cachedProducts = await getCachedProducts();
    if (cachedProducts) {
      return cachedProducts;
    }

    // If no cached data, throw the original error
    throw error;
  }
};

export const getCachedProducts = async (): Promise<Product[] | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);

    if (!cachedData) {
      return null;
    }

    const parsed: CachedProducts = JSON.parse(cachedData);

    // Check if cache is still valid (within 24 hours)
    const now = Date.now();
    const isExpired = now - parsed.timestamp > CACHE_DURATION;

    if (isExpired) {
      // Cache expired, remove it
      await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Error reading cached products:', error);
    return null;
  }
};

export const cacheProducts = async (products: Product[]): Promise<void> => {
  try {
    const cacheData: CachedProducts = {
      data: products,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching products:', error);
  }
};

export const clearProductsCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
  } catch (error) {
    console.error('Error clearing products cache:', error);
  }
};

export const getFromCacheOnly = async (): Promise<Product[]> => {
  const cachedProducts = await getCachedProducts();
  if (!cachedProducts) {
    throw new Error('No cached products available');
  }
  return cachedProducts;
};
