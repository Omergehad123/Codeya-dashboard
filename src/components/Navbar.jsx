import React, { useState } from 'react';
import { Search, Bell, Menu, Sun } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { stats, notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-border px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
        <input 
          type="text" 
          placeholder="Search projects, clients..." 
          className="w-full bg-[#f0f7f3] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 transition-all outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-brand-neon text-brand-deep' : 'bg-[#f0f7f3] text-brand-dark hover:bg-brand-neon/10 hover:text-brand-neon'}`}
          >
            <Bell className="w-5 h-5" />
            {stats.unreadNotificationsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-brand-neon rounded-full border-2 border-white animate-pulse shadow-[0_0_8px_#04d939]" />
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown 
              notifications={notifications}
              onMarkRead={markNotificationRead}
              onMarkAllRead={markAllNotificationsRead}
              onDelete={deleteNotification}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        <button className="p-2.5 bg-[#f0f7f3] rounded-xl text-brand-dark hover:bg-brand-neon/10 hover:text-brand-neon transition-all">
          <Sun className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-[1px] bg-brand-border mx-2" />
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-xs font-bold text-brand-dark">Codeya Admin</p>
            <p className="text-[10px] text-[#6b8a78] font-bold uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-border">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Codeya" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
