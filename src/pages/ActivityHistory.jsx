import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Mail, 
  FolderKanban, 
  Info, 
  CheckCircle2, 
  Trash2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { format } from 'date-fns';

const ActivityHistory = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification 
  } = useDashboard();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || notif.type === filter;
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type) => {
    switch(type) {
      case 'email': return <Mail className="w-5 h-5 text-brand-neon" />;
      case 'project': return <FolderKanban className="w-5 h-5 text-brand-deep" />;
      default: return <Info className="w-5 h-5 text-[#6b8a78]" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Activity History</h1>
          <p className="text-[#6b8a78] font-medium">Clear history of all system events, website leads, and project updates.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllNotificationsRead}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-bold text-brand-neon hover:bg-brand-neon hover:text-white transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
          <input 
            type="text" 
            placeholder="Search activity logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand-border rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 transition-all outline-none"
          />
        </div>
        
        <div className="flex bg-white border border-brand-border p-1.5 rounded-2xl gap-1">
          {['all', 'project', 'email', 'system'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === type ? 'bg-brand-deep text-white shadow-md' : 'text-[#6b8a78] hover:bg-brand-light'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-card !p-0 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-brand-light rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-[#6b8a78] opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark">No activities found</h3>
            <p className="text-[#6b8a78] mt-2 font-medium">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`p-6 flex flex-col md:flex-row md:items-center gap-6 group transition-all duration-300 ${!notif.isRead ? 'bg-brand-neon/[0.03]' : ''}`}
              >
                {/* Icon & Date */}
                <div className="flex items-center gap-4 md:w-48 shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                    ${notif.type === 'email' ? 'bg-brand-neon/10' : 
                      notif.type === 'project' ? 'bg-brand-deep/10' : 'bg-brand-light'}
                  `}>
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">{format(new Date(notif.createdAt), 'MMM dd, yyyy')}</p>
                    <p className="text-[10px] text-[#9dbbb0] font-bold">{format(new Date(notif.createdAt), 'HH:mm')}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest
                      ${notif.type === 'email' ? 'bg-brand-neon text-brand-deep' : 
                        notif.type === 'project' ? 'bg-brand-deep text-white' : 'bg-[#e0ede6] text-[#4a6b58]'}
                    `}>
                      {notif.type}
                    </span>
                    <h4 className="text-sm font-black text-brand-dark underline decoration-brand-neon/30">{notif.title}</h4>
                  </div>
                  <p className="text-sm text-[#4a6b58] font-medium leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.isRead && (
                    <button 
                      onClick={() => markNotificationRead(notif._id)}
                      className="p-2 bg-brand-neon/10 text-brand-neon rounded-xl hover:bg-brand-neon hover:text-white transition-all"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif._id)}
                    className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-400 hover:text-white transition-all"
                    title="Delete record"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-[11px] text-[#9dbbb0] font-bold uppercase tracking-widest px-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Showing last 20 activities
        </div>
        <div>
          Data synchronized with backend
        </div>
      </div>
    </div>
  );
};

export default ActivityHistory;
