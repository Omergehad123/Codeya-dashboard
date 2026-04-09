import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderKanban, DollarSign, Activity, Loader2, Save, Users as UsersIcon, FileText, Globe } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const EditProjectModal = ({ isOpen, onClose, projectData }) => {
  const { updateProject, clients } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    client: '',
    price: '',
    status: 'in progress',
    progress: 0,
    category: [],
    image: null,
  });
  const [categoryInput, setCategoryInput] = useState('');

  const PREDEFINED_CATEGORIES = ['websites', 'landing page', 'ecommerce', 'mobile app', 'ui/ux'];

  const toggleCategory = (cat) => {
    setFormData(prev => {
      if (prev.category.includes(cat)) {
        return { ...prev, category: prev.category.filter(c => c !== cat) };
      }
      return { ...prev, category: [...prev.category, cat] };
    });
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (categoryInput.trim() && !formData.category.includes(categoryInput.trim())) {
      setFormData(prev => ({ ...prev, category: [...prev.category, categoryInput.trim()] }));
      setCategoryInput('');
    }
  };

  const removeCategory = (catToRemove) => {
    setFormData(prev => ({ ...prev, category: prev.category.filter(c => c !== catToRemove) }));
  };

  useEffect(() => {
    if (projectData && isOpen) {
      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        link: projectData.link || '',
        client: projectData.client?._id || projectData.client || '',
        price: projectData.price || '',
        status: projectData.status || 'in progress',
        progress: projectData.progress || 0,
        category: Array.isArray(projectData.category) ? projectData.category : [],
        image: null, // Keep null by default to avoid uploading a string, user must select a new file
      });
    }
  }, [projectData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dbData = new FormData();
      dbData.append('name', formData.name);
      dbData.append('description', formData.description);
      if (formData.link !== undefined) dbData.append('link', formData.link);
      dbData.append('client', formData.client);
      dbData.append('price', Number(formData.price));
      dbData.append('status', formData.status);
      dbData.append('progress', formData.progress);
      dbData.append('category', JSON.stringify(formData.category));
      if (formData.image) {
        dbData.append('image', formData.image);
      }
      
      await updateProject(projectData._id, dbData, true);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[32px] shadow-2xl z-[60] border border-brand-border max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative p-8 pb-4">
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 p-2 hover:bg-brand-light rounded-full text-[#6b8a78] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-14 h-14 bg-brand-neon/10 rounded-2xl flex items-center justify-center text-brand-deep mb-4">
                <FolderKanban className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">Edit Project</h2>
              <p className="text-sm font-medium text-[#6b8a78] mt-1">Update the project details.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Project Title</label>
                  <div className="relative group">
                    <FolderKanban className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Project Image (Leave empty to keep existing)</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-neon/10 file:text-brand-deep hover:file:bg-brand-neon/20 cursor-pointer text-[#6b8a78]"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Project Link (URL)</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://example.com (Optional)"
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Categories</label>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      {PREDEFINED_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${formData.category.includes(cat) ? 'bg-brand-neon text-brand-deep' : 'bg-brand-light text-[#6b8a78] hover:bg-[#c8ddd2]'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { addCategory(e); } }}
                        placeholder="Type custom category..."
                        className="flex-1 bg-brand-light border-none rounded-2xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-6 bg-brand-neon text-brand-deep font-bold rounded-2xl text-sm hover:scale-105 transition-transform"
                      >
                        Add
                      </button>
                    </div>
                    {formData.category.filter(c => !PREDEFINED_CATEGORIES.includes(c)).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.category.filter(c => !PREDEFINED_CATEGORIES.includes(c)).map((cat, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-light border border-brand-border text-xs font-bold text-brand-dark">
                            {cat}
                            <button type="button" onClick={() => removeCategory(cat)} className="hover:text-red-500 transition-colors p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Description</label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-4 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none resize-none h-24"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Client</label>
                  <div className="relative group">
                    <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <select
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none appearance-none"
                    >
                      <option value="" disabled>Select a client</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Budget ($)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <input
                      required
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Status</label>
                  <div className="relative group">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none appearance-none capitalize"
                    >
                      <option value="active">Active</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="stopped">Stopped</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Progress</label>
                    <span className="text-xs font-bold text-brand-neon bg-brand-neon/10 px-2 py-0.5 rounded-md">{formData.progress}%</span>
                  </div>
                  <div className="relative group h-[50px] bg-brand-light rounded-2xl flex items-center px-4 border border-transparent focus-within:ring-2 focus-within:ring-brand-neon/20">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                      className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-neon"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-sm text-[#4a6b58] hover:bg-brand-light transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-[1.5] btn-primary !rounded-2xl flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 group-hover:scale-105 transition-transform" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProjectModal;
