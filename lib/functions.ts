import type { Product, Sort } from '@/types/products';

export const sortedByPrice = (products: Product[], direction: Sort) => {
  return products.sort((a, b) => {
    if (direction === 'asc') {
      return a.price - b.price;
    }
    return b.price - a.price;
  });
};

export const filteredByCategory = (products: Product[], category: string) => {
  return products.filter(product => product.category === category);
};
