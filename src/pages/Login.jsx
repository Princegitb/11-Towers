import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { User, Shield, Lock, Mail, ArrowRight, Building2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import api from '../utils/api'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const initialRole = queryParams.get('role') || 'resident'
  
  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const setUserState = useStore((state) => state.setUser)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
        role
      });
      
      const data = response.data;
      
      // Store locally and inside global Zustand store
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserState(data, data.token);
      
      toast.success("Login Successful!");
      setLoading(false);
      
      // Navigate to respective isolated portal view
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/resident-dashboard');
      }
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response && err.response.data.message 
        ? err.response.data.message 
        : 'Server error. Is the backend running?';
      toast.error(errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/30 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <Building2 size={20} />
          <span className="font-semibold tracking-wide">11 TOWERS</span>
        </Link>

        <GlassCard className="p-10 border-white/10" hover={false}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
            <p className="text-white/50">Access your 11 Towers portal</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 relative">
            <button 
              onClick={() => setRole('resident')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all relative z-10 ${role === 'resident' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <User size={18} />
              Resident
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all relative z-10 ${role === 'admin' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <Shield size={18} />
              Admin
            </button>
            <motion.div 
              layoutId="roleTab"
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl ${role === 'resident' ? 'left-1 bg-brand-primary neon-glow-cyan' : 'left-[calc(50%+2px)] bg-brand-secondary neon-glow-purple'}`}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 block ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 block ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                role === 'admin' ? 'bg-brand-secondary hover:bg-brand-secondary/80 neon-glow-purple' : 'bg-brand-primary hover:bg-brand-primary/80 neon-glow-cyan'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-white/30 text-sm">
            Don't have an account? <span className="text-brand-primary cursor-pointer hover:underline">Contact Society Office</span>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
