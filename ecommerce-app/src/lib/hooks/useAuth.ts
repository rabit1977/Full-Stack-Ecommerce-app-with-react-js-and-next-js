import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { login, logout, signup } from '@/lib/store/thunks/authThunks';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, users } = useAppSelector((state) => state.user);

  const handleLogin = useCallback(
    (email: string, password: string) => {
      return dispatch(login(email, password));
    },
    [dispatch]
  );

  const handleSignup = useCallback(
    (name: string, email: string, password: string) => {
      return dispatch(signup(name, email, password));
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return { user, users, login: handleLogin, logout: handleLogout, signup: handleSignup };
};
