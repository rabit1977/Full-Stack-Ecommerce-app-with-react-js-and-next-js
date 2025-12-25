import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/lib/store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
