import { initializeAuth } from '../store';
import { parse } from 'cookie';

export const initializeAuthFromCookie = (dispatch) => {
  if (typeof window !== 'undefined') {
    const cookies = parse(document.cookie);
    const authToken = cookies.auth_token;

    console.log('Auth token from cookie:', authToken);

    if (authToken) {
      const parsedToken = JSON.parse(authToken);
      console.log('Parsed token:', parsedToken);
      dispatch(initializeAuth({ isLoggedIn: true, session: parsedToken }));
    } else {
      dispatch(initializeAuth({ isLoggedIn: false, session: null }));
    }

    console.log('Authentication state initialized');
  }
};