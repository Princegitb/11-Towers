import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Layers, Camera, Maximize2, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import GlassCard from '../components/GlassCard'
import useStore from '../store/useStore'

const CATEGORIES = ['All', 'A-Blocks', 'B-Blocks', 'C-Blocks', 'Pump House', 'Parks', 'Amenities']

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('All')
  const { images, fetchImages } = useStore()

  React.useEffect(() => {
    fetchImages()
  }, [])

  const filteredImages = images.filter(img => 
    activeTab === 'All' ? true : img.category === activeTab
  )

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      <Navbar />

      {/* Gallery Hero */}
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative h-[300px] rounded-3xl overflow-hidden mb-12 flex items-center justify-center border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-secondary/20 to-brand-accent/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
          
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Interactive 3D Society Map</h1>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              Visualise every corner of the 11 Towers community in stunning detail.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Explore 11 Towers <Layers className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                activeTab === category 
                  ? 'text-white' 
                  : 'text-white/50 hover:text-white/80 glass-card border-white/5'
              }`}
            >
              {activeTab === category && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-brand-primary rounded-full neon-glow-cyan"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>

        {/* Bento Grid Gallery */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <ImageCard key={image._id || image.id} image={image} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

import { getMediaUrl } from '../utils/api'

function ImageCard({ image }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className={`relative group rounded-2xl overflow-hidden glass-card border-white/10 ${
        image.size === 'large' ? 'lg:row-span-2 lg:col-span-2' : ''
      }`}
    >
      <img 
        src={getMediaUrl(image.url)} 
        alt={image.title}
        className="w-full min-h-[250px] h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-wider border border-brand-primary/30">
            {image.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white">{image.title}</h3>
        <button className="mt-4 flex items-center gap-2 text-white/70 hover:text-white text-sm">
          <Maximize2 className="w-4 h-4" /> View Details
        </button>
      </div>

      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  )
}
