import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, DollarSign, Wallet, TrendingUp, Search, Download, Loader2, ArrowUpRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const Invoices = () => {
  const { projects, clients, loading } = useDashboard();

  const { completedRevenue, pendingRevenue, profitPercentage, completedProjects } = useMemo(() => {
    let completed = 0;
    let pending = 0;
    const completedArr = [];

    projects.forEach(p => {
      const price = Number(p.price) || 0;
      if (p.status.toLowerCase() === 'completed') {
        completed += price;
        completedArr.push(p);
      } else {
        pending += price;
      }
    });

    const totalExpected = completed + pending;
    const profitPct = totalExpected > 0 ? ((completed / totalExpected) * 100).toFixed(1) : 0;

    // Sort completed projects by updated date descending (latest money received)
    completedArr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return {
      completedRevenue: completed,
      pendingRevenue: pending,
      profitPercentage: profitPct,
      completedProjects: completedArr
    };
  }, [projects]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-neon animate-spin" />
      </div>
    );
  }

  const statBoxes = [
    {
      title: 'Received Amount',
      value: `$${completedRevenue.toLocaleString()}`,
      subtitle: 'From completed projects',
      icon: DollarSign,
      color: 'brand-neon'
    },
    {
      title: 'Pending Amount',
      value: `$${pendingRevenue.toLocaleString()}`,
      subtitle: 'From active/pending projects',
      icon: Wallet,
      color: 'brand-deep'
    },
    {
      title: 'Profit Realized',
      value: `${profitPercentage}%`,
      subtitle: 'Of total expected revenue',
      trend: '+',
      icon: TrendingUp,
      color: 'brand-neon'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Invoices & Billing</h1>
          <p className="text-[#6b8a78] font-medium">Track your received payments and pending project revenues.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 justify-center">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* 3 Stat Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statBoxes.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="dashboard-card group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="stat-label">{stat.title}</span>
                <h3 className="stat-value mt-2">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color === 'brand-neon' ? 'brand-neon/10' : 'brand-deep/5'}`}>
                <stat.icon className={`w-6 h-6 text-${stat.color === 'brand-neon' ? 'brand-deep' : 'brand-deep'}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#6b8a78]">
              {stat.trend && <ArrowUpRight className="w-3 h-3 text-brand-neon" />}
              <span>{stat.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Latest Received Payments Table */}
      <div className="dashboard-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-brand-dark">Latest Received Payments</h3>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full md:w-64 bg-[#f0f7f3] border-none rounded-xl py-2 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {completedProjects.length === 0 ? (
            <div className="p-12 text-center text-[#6b8a78] font-medium">
              No received payments found. Complete projects to see them here.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-light/50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Invoice ID</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Project</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Client</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {completedProjects.map((project, index) => (
                  <motion.tr 
                    key={project._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-light/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#6b8a78]" />
                        <span className="text-sm font-bold text-brand-dark">INV-{project._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-brand-dark group-hover:text-brand-deep transition-colors">{project.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-[#4a6b58] font-medium">{project.client?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-[#6b8a78]">{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-black text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-lg">
                        +${project.price?.toLocaleString() || 0}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
