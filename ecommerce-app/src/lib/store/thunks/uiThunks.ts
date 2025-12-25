import { AppDispatch } from '../store';
import { setToast } from '../slices/uiSlice';

const TOAST_DURATION = 3000;

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => (dispatch: AppDispatch) => {
  dispatch(setToast({ message, type }));
  setTimeout(() => {
    dispatch(setToast(null));
  }, TOAST_DURATION);
};
