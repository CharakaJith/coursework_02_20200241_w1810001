import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleUser, ChevronsUpDown, LogOut, Pencil, List } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { USER } from '../../common/messages';

function NavUser() {
  const [user, setUser] = useState({});
  const [userName, setUserName] = useState('');

  const { isMobile } = useSidebar();

  const navigate = useNavigate();

  // handle logout
  const handleLogout = () => {
    // clear session storage
    sessionStorage.clear();

    // set message
    sessionStorage.setItem('message', USER.LOGOUT_SUCCESS);

    navigate('/');
  };

  // handle my posts click
  const handleMyPostClick = () => {
    navigate('/posts');
  };

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      const userObject = sessionUser ? JSON.parse(sessionUser) : null;

      setUser(userObject);
      setUserName(`${userObject.firstName[0]}${userObject.lastName[0]}`);
    }
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              {/* avatar logo */}
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{userName}</AvatarFallback>
              </Avatar>

              {/* user name and email */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              {/* drop down icon */}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* drop down  */}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* avatar logo */}
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{userName}</AvatarFallback>
                </Avatar>

                {/* user name and email */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* account */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <CircleUser />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* post */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil />
                New post
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={handleMyPostClick}>
                <List />
                My posts
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* logout */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavUser;
