import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Image as ImageIcon, LogIn } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-8 py-3 bg-white/5 backdrop-blur-md border-white/10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center neon-glow-cyan group-hover:scale-110 transition-transform">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            11 TOWERS
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" label="Home" />
          <NavLink to="/gallery" label="Gallery" icon={<ImageIcon size={18} />} />
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary cursor-pointer"
          >
            <LogIn size={18} />
            Login
          </motion.button>
        </div>

        {/* Mobile Toggle (Simplified for now) */}
        <div className="md:hidden">
           <LogIn className="text-white" />
        </div>
      </div>
    </motion.nav>
  )
}

function NavLink({ to, label, icon }) {
  return (
    <Link to={to} className="relative group flex items-center gap-2 text-white/70 hover:text-white transition-colors py-2">
      {icon}
      <span>{label}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300"></span>
    </Link>
  )
}
