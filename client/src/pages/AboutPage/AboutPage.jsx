import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../../components/app-sidebar/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { USER } from '../../common/messages';

function AboutPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // handle mail click
  const handleMailClick = () => {
    window.location.href = 'mailto:charaka.20200241@iit.ac.lk';
  };

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
    <div>
      <SidebarProvider>
        {/* side nav bar */}
        <AppSidebar />

        <SidebarInset>
          {/* header */}
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-3xl font-bold">About Us</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* body */}
          <div className="flex flex-1 flex-col p-4 h-screen">
            <div className="flex flex-1">
              <div className="w-full h-full rounded-xl bg-[#6A9C89] text-white flex flex-col items-start justify-center space-y-4 p-16 text-lg font-medium">
                <p>
                  TravelTales is an innovative, tourism-focused blogging platform designed as part of the Coursework 02 requirements for the Advanced
                  Server-Side Web Development module. It combines real-time country data with user-generated travel stories to create an engaging,
                  community-driven space where travelers can share experiences and explore the world through authentic narratives.
                </p>
                <p>
                  The goal of this project is to implement a fully functional travel blog web application that allows users to document and share
                  their journeys while integrating rich, real-time information about countries from around the globe. Each story is automatically
                  enhanced with verified country data, offering readers contextual insights alongside personal experiences.
                </p>
                <p>
                  In line with the project requirements, the service was built with a polyglot architecture. For efficient local deployment, the
                  application has been containerized using Docker, ensuring portability and ease of use. This solution provides a secure and
                  streamlined way to access and write blog posts, fulfilling all the requirements outlined in Coursework 01 specifications.
                </p>
                <p>
                  - Charaka Jith Gunasinghe (20200241/w1810001)
                  <br />
                  <p onClick={handleMailClick} className="text-[#A1E3F9] hover:text-[#7BCCE7] cursor-pointer underline">
                    - charaka.20200241@iit.ac.lk
                  </p>
                </p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default AboutPage;
