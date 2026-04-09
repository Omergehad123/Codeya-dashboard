import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Search, ExternalLink, MoreVertical, LayoutGrid, List, Loader2, Edit, Trash2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AddProjectModal from '../components/modals/AddProjectModal';
import EditProjectModal from '../components/modals/EditProjectModal';

const STATUS_FILTERS = ['All', 'active', 'in progress', 'completed', 'stopped'];

const Projects = () => {
  const { projects, loading, delProject } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');

  const handleDelete = async (id) => {
    setActiveDropdown(null);
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      await delProject(id);
    }
  };

  const handleEdit = (project) => {
    setActiveDropdown(null);
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  const filteredProjects = projects.filter(p => {
    const matchesFilter = activeFilter === 'All' || p.status === activeFilter;
    const matchesSearch = search === '' ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Projects Portfolio</h1>
          <p className="text-[#6b8a78] font-medium">Track your project milestones, status, and deliverables.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white border border-brand-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-brand-deep text-white' : 'text-[#6b8a78] hover:bg-brand-light'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-brand-deep text-white' : 'text-[#6b8a78] hover:bg-brand-light'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <div className="dashboard-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search project title or client..."
              className="w-full bg-[#f0f7f3] border-none rounded-xl py-2 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${activeFilter === tab ? 'bg-brand-deep text-white' : 'text-[#6b8a78] hover:bg-brand-light'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-[#6b8a78] font-medium">
            {projects.length === 0
              ? 'No projects found. Use the "New Project" button to get started.'
              : 'No projects match the current filter.'}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {filteredProjects.map((project, index) => (
              <ProjectRow key={project._id} project={project} index={index} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditProjectModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} projectData={projectToEdit} />
    </div>
  );
};

const ProjectCard = ({ project, index, activeDropdown, setActiveDropdown, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className="group border border-brand-border rounded-[20px] p-6 hover:border-brand-neon transition-all hover:bg-brand-light/20 relative"
  >
    <div className="flex justify-between items-start mb-4 z-20 relative">
      <div className="w-12 h-12 bg-brand-deep/5 rounded-2xl flex items-center justify-center text-brand-deep group-hover:bg-brand-neon group-hover:text-brand-deep transition-colors">
        <FolderKanban className="w-6 h-6" />
      </div>
      <DropdownMenu project={project} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} onEdit={onEdit} onDelete={onDelete} />
    </div>
    {project.image && (
      <div className="w-full h-36 mb-4 rounded-2xl overflow-hidden bg-brand-light">
        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
      </div>
    )}
    <div className="mb-4">
      <h3 className="font-serif text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-deep transition-colors">{project.name}</h3>
      <p className="text-sm font-medium text-[#6b8a78]">Client: {project.client?.name || 'Unknown'}</p>
      <p className="text-xs font-bold text-brand-neon mt-1">${project.price?.toLocaleString()}</p>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b8a78]">Progress</span>
        <span className="text-xs font-black text-brand-deep">{project.progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#f0f7f3] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${project.progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="bg-brand-neon h-full rounded-full shadow-[0_0_8px_rgba(4,217,57,0.4)]"
        />
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between pt-4 border-t border-brand-border">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${project.status === 'completed' ? 'bg-brand-neon' : 'bg-brand-deep animate-pulse'}`} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark">{project.status}</span>
      </div>
      <span className="text-[10px] font-bold text-[#6b8a78]">{new Date(project.updatedAt).toLocaleDateString()}</span>
    </div>
  </motion.div>
);

const ProjectRow = ({ project, index, activeDropdown, setActiveDropdown, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.04 }}
    className="flex items-center gap-4 px-6 py-4 hover:bg-brand-light/40 transition-all group"
  >
    {project.image
      ? <img src={project.image} alt={project.name} className="w-12 h-12 rounded-xl object-cover border border-brand-border flex-shrink-0" />
      : <div className="w-12 h-12 bg-brand-deep/5 rounded-xl flex items-center justify-center text-brand-deep flex-shrink-0"><FolderKanban className="w-5 h-5" /></div>
    }
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-brand-dark truncate">{project.name}</p>
      <p className="text-xs text-[#6b8a78]">{project.client?.name || 'Unknown Client'} · ${project.price?.toLocaleString()}</p>
    </div>
    <div className="hidden md:flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${project.status === 'completed' ? 'bg-brand-neon' : 'bg-brand-deep animate-pulse'}`} />
      <span className="text-xs font-bold capitalize text-brand-dark">{project.status}</span>
    </div>
    <div className="w-24 hidden md:block">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-[#6b8a78]">{project.progress}%</span>
      </div>
      <div className="w-full h-1 bg-[#f0f7f3] rounded-full overflow-hidden">
        <div style={{ width: `${project.progress}%` }} className="bg-brand-neon h-full rounded-full" />
      </div>
    </div>
    <DropdownMenu project={project} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} onEdit={onEdit} onDelete={onDelete} />
  </motion.div>
);

const DropdownMenu = ({ project, activeDropdown, setActiveDropdown, onEdit, onDelete }) => (
  <div className="flex items-center gap-1">
    {project.link && (
      <button
        onClick={() => window.open(project.link, '_blank')}
        className="p-2 rounded-lg text-[#6b8a78] hover:bg-white border border-transparent hover:border-brand-border transition-all"
        title="Open Project Link"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    )}
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === project._id ? null : project._id); }}
        className="p-2 hover:bg-white rounded-lg text-[#6b8a78] border border-transparent hover:border-brand-border transition-all"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {activeDropdown === project._id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl border border-brand-border z-30 py-1"
          >
            <button onClick={() => onEdit(project)} className="w-full text-left px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light flex items-center gap-2">
              <Edit className="w-4 h-4 text-[#6b8a78]" /> Edit
            </button>
            <button onClick={() => onDelete(project._id)} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default Projects;
