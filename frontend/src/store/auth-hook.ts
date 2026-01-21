import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { userActions } from './user-slice';
import { authApi } from '@/api/auth';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth hook
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken, isLogin } = useAppSelector((state) => state.user);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login(username, password);
      if (response.success && response.data) {
        dispatch(userActions.login({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }));
        return { success: true };
      } else {
        return { success: false, error: response.error?.message || 'Login failed' };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with local logout even if API call fails
    }
    dispatch(userActions.logout());
  };

  const canManageUsers = (): boolean => {
    return isLogin && (user?.role === 'admin' || user?.isEnvAdmin === true);
  };

  return {
    user,
    accessToken,
    isLogin,
    login,
    logout,
    canManageUsers,
  };
}
