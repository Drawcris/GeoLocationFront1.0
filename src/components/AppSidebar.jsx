import React from 'react';
import { Calendar, Home, Inbox, Search, Settings, User, LogOut, Navigation, Map, UserPlus, MapPinPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Wyznacz trasę', url: '/routingPage', icon: Navigation },
  { title: 'Trasa Google', url: '/googleRoutingPage', icon: Map },
  { title: 'Lista tras', url: '/addRoute', icon: MapPinPlus },
  { title: 'Użytkownicy', url: '/userPage', icon: UserPlus },
  { title: 'Twórca', url: '/creatorPage', icon: User },
  { title: 'Wyszukiwarka', url: '/searchpage', icon: Search },
];

export function AppSidebar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/loginpage');
  };

  return (
    <Sidebar className="w-64">
      <SidebarHeader>
        <div>
          <img src="Koala.jpg" alt="Koala Express" className="w-16 h-16 rounded-full mx-auto" />
        </div>
        <div className="p-4 text-lg font-bold text-center">Koala Express</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="block py-2 px-4 hover:bg-gray-300 hover:text-black">
                      <item.icon className="mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          {user ? (
            <>
              <Link to="/profilePage" className="py-2 px-4 flex  hover:bg-gray-300 hover:text-black">
                <User className="mr-2" /> {user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="block py-2 px-4 hover:bg-gray-300 hover:text-black w-full text-left"
              >
                <div className='flex'>
                <LogOut className="mr-2 text-red-500  hover:text-red-900" /> <p className='text-red-500 hover:text-red-900'> Wyloguj się </p></div>
              </button>
            </>
          ) : (
            <Link to="/loginpage" className="block py-2 px-4 hover:bg-gray-300 hover:text-black">
              <i className="bi bi-box-arrow-in-right mr-2"></i> Zaloguj się
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}