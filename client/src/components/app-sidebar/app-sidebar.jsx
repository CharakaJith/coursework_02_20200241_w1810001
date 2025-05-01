import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { LogOut, Home, Info, Phone, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import map from '@/assets/animations/map.gif';
import NavUser from '../nav-user/nav-user';
import { USER } from '@/common/messages';

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // go to home
  const handleHomeClick = () => {
    navigate('/home');
  };

  // go to community
  const handleCommunityClick = () => {
    navigate('/community');
  };

  // go to about
  const handleAboutClick = () => {
    navigate('/about');
  };

  // go to contact
  const handleContactClick = () => {
    navigate('/contact');
  };

  // handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    sessionStorage.setItem('message', USER.LOGOUT_SUCCESS);
    navigate('/');
  };

  return (
    <Sidebar className="flex flex-col h-full">
      {/* header */}
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarHeader>

      <div className="flex-1 flex flex-col">
        {/* pushes the content to center */}
        <div className="flex-1"></div>

        {/* content */}
        <div className="flex justify-center">
          <SidebarContent>
            <SidebarMenu>
              <SidebarSeparator className="mx-0" />

              <SidebarMenuItem>
                <div className="flex items-center gap-2 ml-5 mr-1">
                  <Home />
                  <SidebarMenuButton
                    onClick={handleHomeClick}
                    className={`hover:bg-[#4A628A] hover:text-white cursor-pointer ${isActive('/home') ? 'bg-[#4A628A] text-white' : ''}`}
                  >
                    Home
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
              <SidebarSeparator className="mx-0" />

              <SidebarMenuItem>
                <div className="flex items-center gap-2 ml-5 mr-1">
                  <Users />
                  <SidebarMenuButton
                    onClick={handleCommunityClick}
                    className={`hover:bg-[#4A628A] hover:text-white cursor-pointer ${isActive('/community') ? 'bg-[#4A628A] text-white' : ''}`}
                  >
                    Community
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
              <SidebarSeparator className="mx-0" />

              <SidebarMenuItem>
                <div className="flex items-center gap-2 ml-5 mr-1">
                  <Info />
                  <SidebarMenuButton
                    onClick={handleAboutClick}
                    className={`hover:bg-[#4A628A] hover:text-white cursor-pointer ${isActive('/about') ? 'bg-[#4A628A] text-white' : ''}`}
                  >
                    About
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
              <SidebarSeparator className="mx-0" />

              <SidebarMenuItem>
                <div className="flex items-center gap-2 ml-5 mr-1">
                  <Phone />
                  <SidebarMenuButton
                    onClick={handleContactClick}
                    className={`hover:bg-[#4A628A] hover:text-white cursor-pointer ${isActive('/contact') ? 'bg-[#4A628A] text-white' : ''}`}
                  >
                    Contact
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
              <SidebarSeparator className="mx-0" />
            </SidebarMenu>
          </SidebarContent>
        </div>

        {/* image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img src={map} alt="Sidebar Illustration" className="w-50 h-50 object-cover" />
            <p className="mt-2 text-sm text-center font-bold">Travel-Tales</p>
          </div>
        </div>
      </div>

      {/* footer */}
      <SidebarFooter className="flex justify-center border-t border-sidebar-border p-4">
        <SidebarMenu className="w-full flex justify-center">
          <SidebarMenuButton className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
