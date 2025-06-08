import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../utils/ErrorHandler';

export const useLocalStorage = <T,>(
  key: string, 
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // Initialize state with the value from localStorage or the provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      ErrorHandler.handle(error, `useLocalStorage error reading key "${key}"`);
      return initialValue;
    }
  });

  // Create a setter function that handles both direct values and updater functions
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error: unknown) {
      ErrorHandler.handle(error, `useLocalStorage error setting key "${key}"`);
    }
  };

  // Update localStorage whenever the state changes (for direct updates)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error: unknown) {
      ErrorHandler.handle(error, `useLocalStorage error setting key in useEffect "${key}"`);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};
