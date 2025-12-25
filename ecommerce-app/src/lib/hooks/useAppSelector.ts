import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/lib/store/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
