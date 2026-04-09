import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to delete this item? This action cannot be undone." }) => {
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden border border-brand-border"
          >
            <div className="relative p-6 pt-8 text-center">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 p-2 hover:bg-brand-light rounded-full text-[#6b8a78] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-2">
                {title}
              </h2>
              <p className="text-sm text-[#6b8a78] leading-relaxed mb-8 px-4">
                {message}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3.5 rounded-2xl font-bold text-sm text-[#4a6b58] bg-brand-light hover:bg-[#c8ddd2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-3.5 rounded-2xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.25)] transition-all hover:shadow-[0_6px_16px_rgba(239,68,68,0.35)] hover:-translate-y-0.5"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
