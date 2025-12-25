import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed Redux hooks for better TypeScript support
 * Use these instead of plain useDispatch and useSelector throughout your app
 */

// Pre-typed dispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Pre-typed selector hook
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Alternative for older Redux Toolkit versions (< 2.0)
 * Uncomment below if using RTK < 2.0:
 * 
 * export const useAppDispatch = () => useDispatch<AppDispatch>();
 * export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
 */