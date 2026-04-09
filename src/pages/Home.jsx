import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Users, FolderKanban, Activity, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const Home = () => {
  const { stats, projects, loading } = useDashboard();

  const STATS_CARDS = [
    { id: 1, label: "Total Revenue", value: stats.totalRevenue, trend: "+12.5%", color: "brand-neon" },
    { id: 2, label: "Active Projects", value: stats.activeProjectsCount, trend: "+2", color: "brand-deep" },
    { id: 3, label: "Total Clients", value: stats.totalClientsCount, trend: "+18", color: "brand-neon" },
    { id: 4, label: "Success Rate", value: stats.successRate, trend: "+0.4%", color: "brand-deep" },
  ];

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
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Dashboard Overview</h1>
        <p className="text-[#6b8a78] font-medium">Welcome back, Admin. Your data is synchronized and live.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="dashboard-card group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="stat-label">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="stat-value">{stat.value}</h2>
              <span className="text-xs font-bold text-brand-neon bg-brand-neon/10 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects Table - 2/3 width */}
        <div className="lg:col-span-2 dashboard-card !p-0 overflow-hidden">
          <div className="p-6 border-b border-brand-border flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-brand-dark">Recent Activity</h3>
            <button className="text-sm font-bold text-brand-neon hover:underline">View all projects</button>
          </div>
          <div className="overflow-x-auto">
            {projects.length === 0 ? (
              <div className="p-12 text-center text-[#6b8a78] font-medium">
                No projects found. Add your first project to see data.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-light/50">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Project Name</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Client</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project._id} className="hover:bg-brand-light transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-brand-dark group-hover:text-brand-deep">{project.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4a6b58]">{project.client?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter
                          ${project.status === 'completed' ? 'bg-brand-neon/10 text-brand-neon' : 
                            project.status === 'active' ? 'bg-brand-deep/10 text-brand-deep' : 'bg-gray-100 text-gray-400'}
                        `}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-[#f0f7f3] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-neon h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity Feed placeholder */}
        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-brand-neon" />
            <h3 className="font-serif text-xl font-bold text-brand-dark">Live Metrics</h3>
          </div>
          <div className="space-y-6">
             <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                <p className="stat-label">System Health</p>
                <div className="flex items-center gap-2 text-brand-neon">
                  <div className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
                  <span className="text-sm font-bold">Connected to Backend</span>
                </div>
             </div>
             <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                <p className="stat-label">Database Status</p>
                <div className="flex items-center gap-2 text-brand-deep">
                  <span className="text-sm font-bold">{projects.length} Records Synced</span>
                </div>
             </div>
          </div>
          <button className="w-full mt-8 btn-primary">
            Sync Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
