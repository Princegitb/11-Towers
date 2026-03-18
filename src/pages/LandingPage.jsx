import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, UserCheck, Smartphone, MapPin, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import GlassCard from '../components/GlassCard'
import HeroTower from '../assets/society_image.png'
import { Link } from 'react-router-dom'

const floatingElements = [...Array(5)].map(() => ({
  initialX: Math.random() * 100 + "%",
  initialY: Math.random() * 100 + "%",
  animX: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
  animY: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
}));
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-dark-bg text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between min-h-[90vh]">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-primary/30 mb-6 bg-brand-primary/10">
            <Zap className="text-brand-accent w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Welcome to the Future</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            11 TOWERS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary">Premium Living</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto lg:mx-0">
             Experience the most advanced residential management system designed for comfort, security, and smart automated living.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/gallery" className="btn-primary py-4 px-8 text-lg">
              Explore Community <ArrowRight />
            </Link>
            <Link to="/login" className="btn-glass py-4 px-8 text-lg border-white/20">
              Resident Portal
            </Link>
          </div>
        </motion.div>

        {/* Graphic Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full h-auto relative mt-12 lg:mt-0 flex justify-center items-center"
        >
          <div className="absolute inset-0 bg-brand-primary/20 blur-[120px] rounded-full filter z-0 animate-pulse"></div>
          <div className="relative z-10 glass-card p-2 rounded-[2rem] border-white/10 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
            <img 
              src={HeroTower} 
              alt="11 Towers Futuristic Visualization" 
              className="w-full max-w-[600px] h-auto object-cover rounded-[1.5rem]"
            />
          </div>
        </motion.div>
      </section>

      {/* Login Portals Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Select Your Portal</h2>
            <p className="text-white/50">Seamless access for both residents and administration staff.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Resident Login Portal */}
            <GlassCard delay={0.1} className="p-8 border-brand-primary/20 bg-brand-primary/5">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center mb-6">
                 <UserCheck className="text-brand-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Resident Portal</h3>
              <p className="text-white/60 mb-8">Access your dashboard for maintenance, water schedules, and complaints.</p>
              <Link to="/login?role=resident" className="btn-primary w-full group justify-center">
                Login as Resident <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </GlassCard>

            {/* Admin Login Portal */}
            <GlassCard delay={0.2} className="p-8 border-brand-secondary/20 bg-brand-secondary/5">
               <div className="w-16 h-16 rounded-2xl bg-brand-secondary/20 flex items-center justify-center mb-6">
                 <ShieldCheck className="text-brand-secondary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Admin Dashboard</h3>
              <p className="text-white/60 mb-8">Manage society operations, monitor complaints, and control water utilities.</p>
              <Link to="/login?role=admin" className="btn-glass w-full border-brand-secondary/30 group hover:border-brand-secondary/60 justify-center">
                 Staff Login <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Floating Elements Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-20 overflow-hidden">
        {floatingElements.map((el, i) => (
          <motion.div
            key={i}
            initial={{ x: el.initialX, y: el.initialY }}
            animate={{ 
              x: el.animX,
              y: el.animY,
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 bg-brand-primary/30 rounded-full blur-[100px]"
          />
        ))}
      </div>
    </div>
  )
}
