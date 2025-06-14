import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

/**
 * Custom hook that persists state to AsyncStorage
 * @param key - The AsyncStorage key to store the value under
 * @param initialValue - The initial value if no stored value exists
 * @returns [value, setValue] - Similar to useState but with persistence
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted value on mount
  useEffect(() => {
    const loadPersistedValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setState(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error(`Error loading persisted state for key "${key}":`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPersistedValue();
  }, [key]);

  // Save to AsyncStorage whenever state changes (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const savePersistedValue = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error saving persisted state for key "${key}":`, error);
      }
    };

    savePersistedValue();
  }, [key, state, isLoaded]);

  const setValue = (value: T | ((prevValue: T) => T)) => {
    setState(prevValue => {
      const newValue = typeof value === 'function' ? (value as (prevValue: T) => T)(prevValue) : value;
      return newValue;
    });
  };

  return [state, setValue];
} 