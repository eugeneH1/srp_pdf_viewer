'use client'

import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // console.log('Redux Provider mounted');
  }, []);

  return <Provider store={store}>{children}</Provider>
}