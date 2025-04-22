import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../../components/app-sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
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
