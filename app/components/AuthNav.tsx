'use client'; // This is a client component
import AuthButton from '../authButton';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const AuthNav: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  // console.log('AuthNav rendering, isLoggedIn:', isLoggedIn);
  return (
    <nav>
      <AuthButton />
    </nav>
  );
};

export default AuthNav;