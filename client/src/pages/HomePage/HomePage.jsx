import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '../../components/app-sidebar/app-sidebar';
import { USER } from '../../common/messages';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      // set message
      sessionStorage.setItem('message', USER.LOGGED_OUT);

      navigate('/');
    }
  }, [navigate]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      {/* side nav bar */}
      <AppSidebar />
    </SidebarProvider>
  );
}

export default HomePage;
