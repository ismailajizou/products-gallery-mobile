import { getAll, getCachedProducts, getFromCacheOnly } from '@/services/products.service';
import type { Product, Sort } from '@/types/products';
import { useEffect, useReducer } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { usePersistedState } from './usePersistedState';

type Action =
  | {
      type: 'SET_INITIAL_PRODUCTS';
      payload: Product[];
    }
  | {
      type: 'SET_CATEGORY';
      payload: { category: string; products: Product[] };
    }
  | {
      type: 'SET_SORT';
      payload: { sort: Sort; products: Product[] };
    }
  | {
      type: 'SET_SEARCH';
      payload: { search: string; products: Product[] };
    }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_IS_ERROR'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_OFFLINE_MODE'; payload: boolean };

type State = {
  initialProducts: Product[];
  products: Product[];
  category: string;
  search: string;
  sort: Sort;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isOfflineMode: boolean;
};

const INITIAL_STATE: State = {
  initialProducts: [],
  products: [],
  category: '',
  search: '',
  sort: 'asc',
  isLoading: true,
  isError: false,
  error: null,
  isOfflineMode: false,
};

const useProducts = () => {
  const [favorites, setFavorites] = usePersistedState<number[]>('favorites', []);
  const { isOnline } = useNetworkStatus();

  const [state, dispatch] = useReducer((state: State, action: Action): State => {
    switch (action.type) {
      case 'SET_INITIAL_PRODUCTS':
        return {
          ...state,
          initialProducts: action.payload,
          products: action.payload,
        };
      case 'SET_CATEGORY':
        return {
          ...state,
          category: action.payload.category,
          products: action.payload.products,
        };
      case 'SET_SORT':
        return {
          ...state,
          sort: action.payload.sort,
          products: action.payload.products,
        };
      case 'SET_SEARCH':
        return {
          ...state,
          search: action.payload.search,
          products: action.payload.products,
        };
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'SET_IS_ERROR':
        return { ...state, isError: action.payload };
      case 'SET_IS_LOADING':
        return { ...state, isLoading: action.payload };
      case 'SET_OFFLINE_MODE':
        return { ...state, isOfflineMode: action.payload };
      default:
        return state;
    }
  }, INITIAL_STATE);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch({ type: 'SET_IS_LOADING', payload: true });
        dispatch({ type: 'SET_IS_ERROR', payload: false });
        dispatch({ type: 'SET_ERROR', payload: null });

        let products: Product[] = [];

        if (isOnline === false) {
          // We're offline, try to get cached products
          try {
            products = await getFromCacheOnly();
            dispatch({ type: 'SET_OFFLINE_MODE', payload: true });
          } catch (error) {
            throw new Error('No internet connection and no cached data available');
          }
        } else {
          // We're online or network status is unknown, try API first
          try {
            products = await getAll(); // This will try API first, then cache
            dispatch({ type: 'SET_OFFLINE_MODE', payload: false });
          } catch (error) {
            // If API fails, try cache
            const cachedProducts = await getCachedProducts();
            if (cachedProducts) {
              products = cachedProducts;
              dispatch({ type: 'SET_OFFLINE_MODE', payload: true });
            } else {
              throw error;
            }
          }
        }

        dispatch({
          type: 'SET_INITIAL_PRODUCTS',
          payload: products,
        });
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_IS_ERROR', payload: true });
        dispatch({ type: 'SET_OFFLINE_MODE', payload: isOnline === false });
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }
    };

    loadProducts();
  }, [isOnline]);

  const applyFiltersAndSort = (products: Product[], category: string, search: string, sort: Sort) => {
    let filteredProducts = [...products];

    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Apply search filter
    if (search) {
      filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      if (sort === 'asc') {
        return a.price - b.price;
      }
      return b.price - a.price;
    });

    return filteredProducts;
  };

  const setCategory = (category: string) => {
    const filteredProducts = applyFiltersAndSort(state.initialProducts, category, state.search, state.sort);

    dispatch({
      type: 'SET_CATEGORY',
      payload: {
        category,
        products: filteredProducts,
      },
    });
  };

  const setSort = (sort: Sort | '') => {
    if (sort === '') {
      dispatch({
        type: 'SET_SORT',
        payload: { sort: 'asc', products: state.initialProducts },
      });
      return;
    }
    const filteredProducts = applyFiltersAndSort(state.initialProducts, state.category, state.search, sort);

    dispatch({
      type: 'SET_SORT',
      payload: { sort, products: filteredProducts },
    });
  };

  const setSearch = (search: string) => {
    const filteredProducts = applyFiltersAndSort(state.initialProducts, state.category, search, state.sort);

    dispatch({
      type: 'SET_SEARCH',
      payload: {
        search,
        products: filteredProducts,
      },
    });
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      }
      return [...prev, product.id];
    });
  };

  return {
    state,
    setCategory,
    setSort,
    setSearch,
    toggleFavorite,
    favorites,
    isOnline: isOnline ?? true, // Default to true if network status is unknown
  };
};

export default useProducts;
