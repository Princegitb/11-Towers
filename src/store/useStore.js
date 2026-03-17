import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import toast from 'react-hot-toast';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const DEFAULT_NOTICES = [
  { id: 1, title: 'Elevator Maintenance', date: new Date().toISOString(), content: 'Block A elevator 2 will be down for scheduled maintenance.', isHighPriority: true },
  { id: 2, title: 'Holi Celebration', date: new Date().toISOString(), content: 'Join us for the community celebration in the main park.', isHighPriority: false },
  { id: 3, title: 'Security Alert', date: new Date().toISOString(), content: 'Please ensure all guest vehicles are registered at the gate.', isHighPriority: true }
];

const getStoredNotices = () => {
  try {
    const stored = localStorage.getItem('11towers_notices');
    if (!stored) {
      localStorage.setItem('11towers_notices', JSON.stringify(DEFAULT_NOTICES));
      return DEFAULT_NOTICES;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return DEFAULT_NOTICES;
    const migrated = parsed.map(n => ({
      ...n,
      date: n.date || n.time || new Date().toISOString(),
      isHighPriority: n.isHighPriority !== undefined ? n.isHighPriority : (n.urgent || false)
    }));
    localStorage.setItem('11towers_notices', JSON.stringify(migrated));
    return migrated;
  } catch (error) {
    console.error("Error parsing stored notices:", error);
    return DEFAULT_NOTICES;
  }
};

const getStoredWaterStatus = () => {
  try {
    const stored = localStorage.getItem('11towers_water_status');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    return [];
  }
};

const useStore = create(
  persist(
    (set, get) => ({
      // User Session State
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      },

      // Backend Integrated State: Complaints
      complaints: [],
      fetchComplaints: async () => {
        try {
          const { token } = get();
          if(!token) return;
          const res = await api.get(`${API_URL}/complaints`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ complaints: res.data });
        } catch (error) {
          console.error("Failed to fetch complaints");
        }
      },
      addComplaint: async (complaintData) => {
        try {
          const { token, complaints } = get();
          const res = await api.post(`${API_URL}/complaints`, complaintData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ complaints: [res.data, ...complaints] });
          toast.success("Complaint submitted successfully!");
        } catch (error) {
          console.error("Complaint submission error:", error.response?.data || error.message);
          toast.error("Failed to submit complaint.");
        }
      },
      updateComplaintStatus: async (id, status) => {
        try {
          const { token, complaints } = get();
          const res = await api.put(`${API_URL}/complaints/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({
            complaints: complaints.map(c => c._id === id ? res.data : c)
          });
          toast.success(`Complaint status marked as ${status}!`);
        } catch (error) {
          toast.error("Failed to update status.");
        }
      },

      // Backend Integrated State: Images/Gallery
      images: [],
      fetchImages: async () => {
        try {
          const res = await api.get(`${API_URL}/images`);
          set({ images: res.data });
        } catch (error) {
          console.error("Failed to fetch images");
        }
      },
      uploadImageGalleryAdmin: async (formData) => {
        try {
          const { token, images } = get();
          const res = await api.post(`${API_URL}/images`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          set({ images: [res.data, ...images] });
          toast.success("Image successfully uploaded to Gallery!");
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to upload image.");
          return false;
        }
      },
      deleteImage: async (id) => {
        try {
          const { token, images } = get();
          await api.delete(`${API_URL}/images/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ images: images.filter(img => img._id !== id) });
          toast.success("Image removed from gallery.");
        } catch (error) {
          toast.error("Failed to delete image.");
        }
      },

      // LocalStorage Persisted State: Notices (Mock DB)
      notices: getStoredNotices(),
      addNotice: (notice) => {
        const { notices } = get();
        const newNotice = { 
          id: Date.now(), 
          title: notice.title, 
          content: notice.content, 
          isHighPriority: notice.isHighPriority, 
          date: new Date().toISOString() 
        };
        console.log("Adding new notice:", newNotice);
        const updatedNotices = [newNotice, ...notices];
        set({ notices: updatedNotices });
        localStorage.setItem('11towers_notices', JSON.stringify(updatedNotices));
        window.dispatchEvent(new Event('noticesUpdated'));
        toast.success("Notice published to all residents!");
      },
      syncNotices: () => {
        const freshNotices = getStoredNotices();
        console.log("Syncing notices, count:", freshNotices.length);
        set({ notices: freshNotices });
      },

      usersOverview: [
        { id: 1, name: 'Vikram Singh', flat: 'A4-802', status: 'PAID' },
        { id: 2, name: 'Priya Patel', flat: 'C2-201', status: 'DUE' },
        { id: 3, name: 'Aaryan Sharma', flat: 'A2-402', status: 'PAID' },
        { id: 4, name: 'Saurav Das', flat: 'B1-505', status: 'PAID' },
        { id: 5, name: 'Meera I.', flat: 'A3-1102', status: 'DUE' }
      ],
      payDue: (id) => {
         const { usersOverview } = get();
         set({ usersOverview: usersOverview.map(u => u.id === id ? {...u, status: 'PAID'} : u) });
         toast.success("Payment Received Successfully");
      },

      amenities: [
        { id: 1, name: 'Tennis Court', booked: false },
        { id: 2, name: 'Community Hall', booked: true },
      ],
      bookAmenity: (id) => {
         const { amenities } = get();
         set({ amenities: amenities.map(a => a.id === id ? {...a, booked: true} : a) });
         toast.success("Amenity Booking Confirmed!");
      },

      maintenanceBills: [
        { id: 1, month: 'February', amount: 3450, date: 'Feb 02' },
        { id: 2, month: 'January', amount: 3450, date: 'Jan 05' },
      ],
      
      // Water Schedule Persisted State
      waterStatus: getStoredWaterStatus(),
      setWaterStatus: (schedules) => {
         set({ waterStatus: schedules });
         localStorage.setItem('11towers_water_status', JSON.stringify(schedules));
         window.dispatchEvent(new Event('waterUpdated'));
         toast.success("Water schedule updated!");
      },
      syncWaterStatus: () => {
         set({ waterStatus: getStoredWaterStatus() });
      }
    }),
    {
      name: '11towers-global-state',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        usersOverview: state.usersOverview,
        amenities: state.amenities,
        maintenanceBills: state.maintenanceBills
      }),
    }
  )
);

export default useStore;
