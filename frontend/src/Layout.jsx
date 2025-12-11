import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Users, 
  FileBarChart,
  ShieldCheck, 
  Menu, 
  X,
  PlusCircle,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";


export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Parties', icon: Users, path: '/Parties' },
    { name: 'Reports', icon: FileBarChart, path: '/Reports' },
    ...(user?.role === 'admin' ? [
      { name: 'Notifications', icon: Bell, path: '/Notifications' },
      { name: 'Admin', icon: ShieldCheck, path: '/Admin' }
    ] : []),
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Ledger<span className="font-light text-gray-800">App</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Business Book</p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={createPageUrl(item.path === '/' ? 'Dashboard' : item.name)}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive(item.path) 
                ? 'bg-blue-50 text-blue-700 shadow-sm font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}>
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.name}
            </div>
          </Link>
        ))}
      </nav>

      {/* Quick Action - Disabled for now */}
      {/* <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 text-white shadow-lg">
          <p className="text-sm font-medium opacity-90">Quick Action</p>
          <p className="text-xs text-gray-300 mt-1 mb-3">Add new record</p>
          <Button 
            className="w-full bg-white text-gray-900 hover:bg-gray-100 border-none h-8 text-xs font-semibold"
            size="sm"
            onClick={() => {
                window.location.href = createPageUrl('Dashboard') + '?action=add';
            }}
          >
            <PlusCircle className="w-3.5 h-3.5 mr-2" /> New Entry
          </Button>
        </div>
      </div> */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Header with Navigation */}
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between shadow-sm bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden -ml-2 text-gray-500"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Ledger<span className="font-light text-gray-800">App</span>
            </h1>
            <span className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-wider font-medium">Business Book</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.path === '/' ? 'Dashboard' : item.name)}
              >
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 group
                  ${isActive(item.path) 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}>
                  <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notification Bell (Admin only) */}
          <NotificationBell />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border-2 border-indigo-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="transition-all duration-300">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}