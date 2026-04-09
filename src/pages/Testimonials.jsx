import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MessageSquare, Edit2, Trash2, Calendar, Star } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AddTestimonialModal from '../components/modals/AddTestimonialModal';
import EditTestimonialModal from '../components/modals/EditTestimonialModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

const Testimonials = () => {
  const { testimonials, delTestimonial } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const filteredTestimonials = testimonials.filter(t => 
    t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (selectedTestimonial) {
      await delTestimonial(selectedTestimonial._id);
      setIsDeleteModalOpen(false);
      setSelectedTestimonial(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Testimonials</h1>
          <p className="text-[#6b8a78] mt-1">Manage client reviews and feedback.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Search Layout */}
      <div className="bg-white p-4 rounded-[24px] border border-brand-border flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78]" />
          <input
            type="text"
            placeholder="Search reviews by name, role or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-light border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-neon/20 outline-none"
          />
        </div>
      </div>

      {/* Data Visual UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTestimonials.map((t) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={t._id}
              className="bg-white rounded-[24px] border border-brand-border overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-light flex items-center justify-center">
                      {t.image ? (
                        <img src={t.image} alt={t.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <MessageSquare className="w-5 h-5 text-[#6b8a78]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-dark truncate">{t.clientName}</h3>
                      <p className="text-xs text-[#6b8a78]">{t.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} `} />
                  ))}
                </div>

                <p className="text-sm text-[#4a6b58] leading-relaxed line-clamp-4 flex-1">
                  "{t.message}"
                </p>

                <div className="flex items-center justify-between border-t border-brand-border mt-6 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#6b8a78]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setSelectedTestimonial(t);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-[#6b8a78] hover:text-brand-neon hover:bg-brand-neon/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedTestimonial(t);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[32px] border border-brand-border border-dashed">
          <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-[#6b8a78]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">No Testimonials Found</h3>
          <p className="text-[#6b8a78] max-w-sm mx-auto mb-8">
            Start adding testimonials to showcase your clients' satisfaction on the platform.
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            Add First Testimonial
          </button>
        </div>
      )}

      {/* Modals */}
      <AddTestimonialModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <EditTestimonialModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTestimonial(null);
        }} 
        testimonialData={selectedTestimonial}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTestimonial(null);
        }}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${selectedTestimonial?.clientName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Testimonials;
