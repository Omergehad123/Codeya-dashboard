import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, FolderKanban, Info, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ notifications, onMarkRead, onMarkAllRead, onDelete, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 mt-4 w-96 bg-white/90 backdrop-blur-xl border border-brand-border rounded-3xl shadow-2xl z-50 overflow-hidden"
      >
        <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-light/30">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-dark">Notifications</h3>
            <p className="text-[10px] text-[#6b8a78] font-bold uppercase tracking-widest mt-0.5">
              {notifications.filter(n => !n.isRead).length} Unread Alerts
            </p>
          </div>
          <button 
            onClick={onMarkAllRead}
            className="text-[11px] font-black text-brand-neon hover:text-brand-deep transition-colors bg-brand-neon/10 px-3 py-1.5 rounded-full"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <Bell className="w-8 h-8 text-[#6b8a78]" />
              </div>
              <p className="text-sm font-bold text-[#6b8a78]">No notifications yet</p>
              <p className="text-[11px] text-[#9dbbb0] mt-1">Your activity history will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-border">
              {notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-5 flex gap-4 hover:bg-brand-light/50 transition-colors group relative ${!notif.isRead ? 'bg-brand-neon/5' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 
                    ${notif.type === 'email' ? 'bg-brand-neon/15 text-brand-neon' : 
                      notif.type === 'project' ? 'bg-brand-deep/15 text-brand-deep' : 'bg-brand-light text-[#6b8a78]'}
                  `}>
                    {notif.type === 'email' && <Mail className="w-5 h-5" />}
                    {notif.type === 'project' && <FolderKanban className="w-5 h-5" />}
                    {notif.type === 'system' && <Info className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-black text-brand-dark leading-none">{notif.title}</p>
                      {!notif.isRead && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-neon shadow-[0_0_8px_#04d939]" />
                      )}
                    </div>
                    <p className="text-[12px] text-[#4a6b58] leading-relaxed font-medium">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Clock className="w-3 h-3 text-[#9dbbb0]" />
                      <span className="text-[10px] font-bold text-[#9dbbb0] uppercase tracking-tighter">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Actions on hover */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    {!notif.isRead && (
                      <button 
                        onClick={() => onMarkRead(notif._id)}
                        className="p-1.5 bg-white border border-brand-border rounded-lg text-brand-neon hover:bg-brand-neon hover:text-white transition-all shadow-sm"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(notif._id)}
                      className="p-1.5 bg-white border border-brand-border rounded-lg text-red-400 hover:bg-red-400 hover:text-white transition-all shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-brand-light/10 border-t border-brand-border text-center">
            <Link 
              to="/activity" 
              onClick={onClose}
              className="text-[10px] font-black text-[#6b8a78] hover:text-brand-deep uppercase tracking-widest transition-colors"
            >
              View Activity History
            </Link>
        </div>
      </motion.div>
    </>
  );
};

export default NotificationDropdown;
