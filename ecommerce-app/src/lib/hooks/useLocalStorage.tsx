// src/lib/hooks/useLocalStorageReducer.ts

import { Reducer, useEffect, useReducer } from 'react';

// Helper function to create a new state object without the excluded keys
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const newObj = { ...obj };
  for (const key of keys) {
    delete newObj[key];
  }
  return newObj;
}

// A replacer for JSON.stringify to handle complex types
const replacer = (key: string, value: unknown): unknown => {
  if (value instanceof Set) {
    return Array.from(value);
  }
  return value;
};

/**
 * An enhanced useReducer hook that persists state to localStorage,
 * with an option to exclude certain keys from being stored.
 */
export const useLocalStorageReducer = <S extends object, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  storageKey: string,
  options?: {
    initializer?: (parsedState: S) => S;
    exclude?: (keyof S)[];
  }
): [S, React.Dispatch<A>] => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (defaultInitialState: S): S => {
      if (typeof window === 'undefined') {
        return defaultInitialState;
      }
      try {
        const storedState = localStorage.getItem(storageKey);
        if (!storedState) return defaultInitialState;

        // Combine the fresh initial state with the stored state.
        // This ensures excluded keys (like 'products') are always fresh.
        const parsedState = { ...defaultInitialState, ...JSON.parse(storedState) };

        return options?.initializer ? options.initializer(parsedState) : parsedState;
      } catch (error) {
        console.error(`Failed to load state for key "${storageKey}" from localStorage:`, error);
        return defaultInitialState;
      }
    }
  );

  useEffect(() => {
    try {
      // Before saving, remove any keys that should be excluded.
      const stateToStore = options?.exclude ? omit(state, options.exclude) : state;

      const serializedState = JSON.stringify(stateToStore, replacer);
      localStorage.setItem(storageKey, serializedState);
    } catch (error) {
      console.error(`Failed to save state for key "${storageKey}" to localStorage:`, error);
    }
  }, [state, storageKey, options?.exclude]);

  return [state, dispatch];
};