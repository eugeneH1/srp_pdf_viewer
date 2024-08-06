'use client'; // This is a client component
import AuthButton from '../authButton';
import { useAuth } from '../AuthContex';

const AuthNav: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Access the authentication state
  // console.log("in auth nav: ",isLoggedIn);
  return (
    <nav>
      <AuthButton isLoggedIn={isLoggedIn} />
    </nav>
  );
};

export default AuthNav;