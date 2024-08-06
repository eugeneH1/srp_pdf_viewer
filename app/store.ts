import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  session: any;
}

// Function to check for a valid session
const checkForValidSession = (): AuthState => {
  if (typeof window !== 'undefined') {
    const storedSession = localStorage.getItem('auth_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        // You might want to add additional validation here
        return { isLoggedIn: true, session };
      } catch (error) {
        console.error('Error parsing stored session:', error);
      }
    }
  }
  return { isLoggedIn: false, session: null };
};

const initialState: AuthState = checkForValidSession();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.session = action.payload;
      localStorage.setItem('auth_session', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.session = null;
      localStorage.removeItem('auth_session');
    },
    initializeAuth: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.session = action.payload.session;
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;