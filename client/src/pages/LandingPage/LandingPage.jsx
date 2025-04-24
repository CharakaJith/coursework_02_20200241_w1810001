import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import map from '../../assets/animations/map.gif';
import SignUpForm from '@/components/sign-up/signup-form';
import LoginForm from '@/components/log-in/login-form';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);

      navigate('/home');
    }
  }, [navigate]);

  if (isLoggedIn) return null;

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-gradient-to-r from-blue-950 via-blue-500 to-white">
      {/* landing image (left) */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img src={map} alt="Animated map" className="max-w-[300px] max-h-[300px] object-contain mb-4" />
            <h1 className="text-white text-xl font-semibold text-center">A Global Journey Through Stories</h1>
          </div>
        </div>
      </div>

      {/* login/signup form (right) */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md text-center">
          {showLogin ? <LoginForm goToSignup={() => setShowLogin(false)} /> : <SignUpForm goToLogin={() => setShowLogin(true)} />}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
