import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, History, Code2, Receipt, MessageSquare } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Users, label: 'Clients', path: '/users' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: MessageSquare, label: 'Testimonials', path: '/testimonials' },
    { icon: Receipt, label: 'Invoices', path: '/invoices' },
    { icon: History, label: 'Activity History', path: '/activity' },
  ];

  return (
    <aside className="w-72 bg-brand-deep h-screen sticky top-0 flex flex-col text-white overflow-hidden">
      {/* Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-neon rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(4,217,57,0.3)]">
          <Code2 className="text-brand-deep w-6 h-6" />
        </div>
        <span className="font-serif text-2xl font-black tracking-tight tracking-wider uppercase">
          Codeya
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-white/10 text-brand-neon' 
                : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-bold text-sm tracking-wide">{item.label}</span>
            {/* Active Indicator */}
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-neon opacity-0 transition-opacity duration-300 group-[.active]:opacity-100" />
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-6 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-brand-neon flex items-center justify-center font-bold text-brand-deep text-sm">
            CA
          </div>
          <div>
            <p className="text-xs font-bold text-white">Codeya Admin</p>
            <p className="text-[10px] text-white/40">Super User</p>
          </div>
        </div>
      </div>

      {/* Decoration */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-neon/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-10 w-20 h-20 bg-brand-neon/5 rounded-full blur-2xl pointer-events-none" />
    </aside>
  );
};

export default Sidebar;
