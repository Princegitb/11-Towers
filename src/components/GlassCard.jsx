import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function GlassCard({ children, className, hover = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, scale: 1.02, transition: { duration: 0.2 } } : {}}
      className={cn(
        "glass-card p-6 overflow-hidden relative group",
        className
      )}
    >
      {/* Background Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur-xl"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
