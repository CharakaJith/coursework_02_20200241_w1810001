import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../../components/app-sidebar/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import CommunityDisplay from '../../components/community-display/community-display';
import { USER } from '../../common/messages';

function CommunityPage() {
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

      <SidebarInset>
        {/* header */}
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-3xl font-bold">Community</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* community display */}
        <CommunityDisplay />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default CommunityPage;
