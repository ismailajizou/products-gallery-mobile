import type { Product } from '@/types/products';
import { api } from '../lib/api';

export const getAll = async () => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};
