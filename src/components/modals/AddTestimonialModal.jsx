import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Plus, MessageSquare, User, Star } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const AddTestimonialModal = ({ isOpen, onClose }) => {
  const { addTestimonial } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    role: '',
    message: '',
    rating: 5,
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dbData = new FormData();
      dbData.append('clientName', formData.clientName);
      dbData.append('role', formData.role);
      dbData.append('message', formData.message);
      dbData.append('rating', Number(formData.rating));
      if (formData.image) {
        dbData.append('image', formData.image);
      }
      
      await addTestimonial(dbData, true);
      onClose();
      setFormData({ clientName: '', role: '', message: '', rating: 5, image: null });
    } catch (error) {
      console.error('Error adding testimonial:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[32px] shadow-2xl z-[60] overflow-hidden border border-brand-border"
          >
            <div className="relative p-8 pb-4">
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 p-2 hover:bg-brand-light rounded-full text-[#6b8a78] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 bg-brand-neon/10 rounded-2xl flex items-center justify-center text-brand-deep mb-4">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">Create Testimonial</h2>
              <p className="text-sm font-medium text-[#6b8a78] mt-1">Add a new client review.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Client Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <input
                      required
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Client Image</label>
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
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Role / Company</label>
                  <div className="relative group">
                    <input
                      required
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. CEO at Generic Inc."
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Message</label>
                  <div className="relative group">
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none resize-none h-24"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">Rating</label>
                  <div className="relative group">
                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
                    <select
                      required
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full bg-brand-light border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none appearance-none"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
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
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      Add Testimonial
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

export default AddTestimonialModal;
