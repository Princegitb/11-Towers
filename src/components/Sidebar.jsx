import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Building2, 
  LayoutDashboard, 
  Droplet, 
  CreditCard, 
  MessageSquare, 
  Phone, 
  LogOut,
  Settings,
  Image as ImageIcon
} from 'lucide-react'
import GlassCard from './GlassCard'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function Sidebar({ role = 'resident' }) {
  const { logout } = useStore();
  const residentLinks = [
    { to: '/resident-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/resident-dashboard/water', label: 'Water Schedule', icon: <Droplet size={20} /> },
    { to: '/resident-dashboard/maintenance', label: 'Maintenance', icon: <CreditCard size={20} /> },
    { to: '/resident-dashboard/complaints', label: 'Complaints', icon: <MessageSquare size={20} /> },
    { to: '/resident-dashboard/emergency', label: 'Emergency', icon: <Phone size={20} /> },
  ]

  const adminLinks = [
    { to: '/admin-dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { to: '/admin-dashboard/water-control', label: 'Water Control', icon: <Droplet size={20} /> },
    { to: '/admin-dashboard/users', label: 'Residents', icon: <Building2 size={20} /> },
    { to: '/admin-dashboard/complaints-mgmt', label: 'Complaints', icon: <MessageSquare size={20} /> },
    { to: '/admin-dashboard/gallery', label: 'Manage Gallery', icon: <ImageIcon size={20} /> },
  ]

  const links = role === 'admin' ? adminLinks : residentLinks

  return (
    <div className="w-64 h-screen fixed left-0 top-0 z-40 p-4 hidden lg:block">
      <GlassCard className="h-full flex flex-col p-6 border-white/10" hover={false}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center neon-glow-cyan">
             <Building2 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">11 TOWERS</span>
        </Link>

        {/* Links */}
        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.split('/').length === 2}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group
                ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-white/50 hover:text-white hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-brand-primary' : 'group-hover:text-white transition-colors'}>
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebarActive"
                      className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-full shadow-[0_0_10px_#0ea5e9]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 space-y-2">
           <Link onClick={logout} to="/" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all">
             <LogOut size={20} />
             <span className="font-medium">Logout</span>
           </Link>
        </div>
      </GlassCard>
    </div>
  )
}
