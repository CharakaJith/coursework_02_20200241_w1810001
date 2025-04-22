import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import DatePicker from '../date-picker/date-picker';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarSeparator } from '@/components/ui/sidebar';
import NavUser from '../nav-user/nav-user';

function AppSidebar() {
  const navigate = useNavigate();

  // handle logout
  const handleLogout = () => {
    // clear session storage
    sessionStorage.clear();

    navigate('/');
  };

  return (
    <Sidebar>
      {/* header */}
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarHeader>

      {/* content */}
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
      </SidebarContent>

      {/* footer */}
      <SidebarFooter className="flex justify-center border-t border-sidebar-border p-4">
        <SidebarMenu className="w-full flex justify-center">
          <SidebarMenuButton className="flex items-center gap-2" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
