import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Plus, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AddClientModal from '../components/modals/AddClientModal';

const Users = () => {
  const { clients, loading } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-neon animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Clients Management</h1>
          <p className="text-[#6b8a78] font-medium">Manage and monitor your client partnerships and active projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
          <input 
            type="text" 
            placeholder="Search clients by name or email..." 
            className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 transition-all outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-bold text-[#4a6b58] hover:bg-brand-light transition-all">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="dashboard-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {clients.length === 0 ? (
            <div className="p-12 text-center text-[#6b8a78] font-medium">
              No clients found in the database.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-light/50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Member</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Email</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Phone</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Projects</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {clients.map((user, index) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-light/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f0f7f3] border border-brand-border flex items-center justify-center font-serif font-black text-brand-deep">
                          {user.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-dark group-hover:text-brand-deep">{user.name}</p>
                          <p className="text-[10px] text-brand-neon font-bold uppercase tracking-widest mt-0.5">ID: {user._id.slice(-4).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-[#4a6b58] font-medium">
                        <Mail className="w-3.5 h-3.5 opacity-40" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-brand-dark font-medium">
                         {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-neon" />
                        <span className="text-xs font-bold text-brand-deep">{user.projects?.length || 0} Projects</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-brand-light rounded-lg text-[#6b8a78] transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Users;

