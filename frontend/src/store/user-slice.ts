import { createSlice } from '@reduxjs/toolkit';

export interface User {
  id: number;
  username: string;
  role: string;
  isEnvAdmin?: boolean;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  isLogin: boolean;
}

const loadState = (): UserState => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return {
        user: null,
        accessToken: null,
        isLogin: false,
      };
    }
    return JSON.parse(serializedState);
  } catch {
    return {
      user: null,
      accessToken: null,
      isLogin: false,
    };
  }
};

const saveState = (state: UserState) => {
  try {
    const serializedState = JSON.stringify({
      user: state.user,
      accessToken: state.accessToken,
      isLogin: state.isLogin,
    });
    localStorage.setItem('authState', serializedState);
  } catch {
    // Ignore save errors
  }
};

const initialState: UserState = loadState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: { payload: User | null }) {
      state.user = action.payload;
      saveState(state);
    },
    setAccessToken(state, action: { payload: string | null }) {
      state.accessToken = action.payload;
      saveState(state);
    },
    setLoginState(state, action: { payload: boolean }) {
      state.isLogin = action.payload;
      saveState(state);
    },
    login(state, action: { payload: { user: User; accessToken: string } }) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLogin = true;
      saveState(state);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isLogin = false;
      saveState(state);
    },
  },
});

export const userActions = {
  ...userSlice.actions,
  updateLoginState: userSlice.actions.setLoginState,
};
export default userSlice.reducer;
