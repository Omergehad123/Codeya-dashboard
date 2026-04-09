import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/projects');
      if (response.data.status === 'success') {
        setProjects(response.data.data.projects);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get('/clients');
      if (response.data.status === 'success') {
        setClients(response.data.data.clients);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      if (response.data.status === 'success') {
        setNotifications(response.data.data.notifications);
      }
    } catch (err) {
      console.error("Notifications fetch error:", err.message);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axiosInstance.get('/testimonials');
      if (response.data.status === 'success') {
        setTestimonials(response.data.data.testimonials);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchProjects(), fetchClients(), fetchNotifications(), fetchTestimonials()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Computed Statistics
  const stats = useMemo(() => {
    const totalRevenue = projects.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const activeProjects = projects.filter(p => ['active', 'in progress'].includes(p.status.toLowerCase())).length;
    const completedProjects = projects.filter(p => p.status.toLowerCase() === 'completed').length;
    const successRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;
    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

    return {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      activeProjectsCount: activeProjects,
      totalClientsCount: clients.length,
      successRate: `${successRate.toFixed(1)}%`,
      projectsLoaded: projects.length,
      unreadNotificationsCount
    };
  }, [projects, clients, notifications]);

  const value = {
    projects,
    clients,
    notifications,
    testimonials,
    stats,
    loading,
    error,
    refreshData,
    fetchNotifications,
    markNotificationRead: async (id) => {
      await axiosInstance.patch(`/notifications/${id}`);
      fetchNotifications();
    },
    markAllNotificationsRead: async () => {
      await axiosInstance.patch('/notifications/mark-all-read');
      fetchNotifications();
    },
    deleteNotification: async (id) => {
      await axiosInstance.delete(`/notifications/${id}`);
      fetchNotifications();
    },
    addProject: async (data, isFormData = false) => {
      try {
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        await axiosInstance.post('/projects', data, config);
        await refreshData();
        toast.success("Project added successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add project");
        throw err;
      }
    },
    updateProject: async (id, data, isFormData = false) => {
      try {
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        await axiosInstance.patch(`/projects/${id}`, data, config);
        await refreshData();
        toast.success("Project updated successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update project");
        throw err;
      }
    },
    delProject: async (id) => {
      try {
        await axiosInstance.delete(`/projects/${id}`);
        await refreshData();
        toast.success("Project deleted successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete project");
        throw err;
      }
    },
    addClient: async (data) => {
      try {
        await axiosInstance.post('/clients', data);
        await refreshData();
        toast.success("Client added successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add client");
        throw err;
      }
    },
    addTestimonial: async (data, isFormData = false) => {
      try {
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        await axiosInstance.post('/testimonials', data, config);
        await refreshData();
        toast.success("Testimonial added successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add testimonial");
        throw err;
      }
    },
    updateTestimonial: async (id, data, isFormData = false) => {
      try {
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        await axiosInstance.patch(`/testimonials/${id}`, data, config);
        await refreshData();
        toast.success("Testimonial updated successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update testimonial");
        throw err;
      }
    },
    delTestimonial: async (id) => {
      try {
        await axiosInstance.delete(`/testimonials/${id}`);
        await refreshData();
        toast.success("Testimonial deleted successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete testimonial");
        throw err;
      }
    }
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
