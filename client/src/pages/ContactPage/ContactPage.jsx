import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../../components/app-sidebar/app-sidebar';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import contact from '../../assets/images/contact.jpg';

function ContactPage() {
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
                  <BreadcrumbPage className="text-3xl font-bold">Contact Us</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* body */}
          <div className="flex flex-1 flex-row p-4 h-screen">
            <div className="w-1/2 h-full rounded-xl bg-[#FFE3E1] text-black flex flex-col items-start justify-center space-y-4 p-16 text-lg font-medium">
              <h4 className="text-xl mb-0 text-[#6A9C89] font-bold">How can we help you?</h4>
              <h1 className="text-8xl font-extrabold">Contact Us</h1>

              <p className="mb-0 text-xl">We are here to help and answer any questions you might have.</p>
              <p className="text-xl">We look forward to hearing from you!</p>

              <div className="flex items-center space-x-2 mb-2 mt-6">
                <MapPin />
                <p>18/2, 1st Lane, Gammana Rd, Maharagama</p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Phone />
                <p>+94 70 1454256</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail />
                <p className="text-[#6A9C89] hover:text-[#4F7C63] cursor-pointer">charaka.info@gmail.com</p>
              </div>
            </div>

            <div className="w-1/2 h-full rounded-xl flex flex-col items-start justify-center space-y-4 p-16 text-lg font-medium ml-4 border-4 border-[#6A9C89] shadow-lg">
              <img src={contact} className="max-w-[80%] mx-auto" alt="Contact" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default ContactPage;
