import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Tag, 
  Plus, 
  X, 
  CheckCircle2, 
  Loader2,
  Filter
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import GlassCard from '../../components/GlassCard'
import useStore from '../../store/useStore'

const CATEGORIES = ['A-Blocks', 'B-Blocks', 'C-Blocks', 'Pump House', 'Parks', 'Amenities']

export default function AdminImageManager() {
  const { images, fetchImages, uploadImageGalleryAdmin, deleteImage } = useStore()

  React.useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [newImageData, setNewImageData] = useState({ title: '', category: 'A-Blocks' })

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return;
    
    setUploading(true)
    
    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('title', newImageData.title)
    formData.append('category', newImageData.category)
    
    const success = await uploadImageGalleryAdmin(formData)
    
    setUploading(false)
    if (success) {
      setNewImageData({ title: '', category: 'A-Blocks' })
      setSelectedFile(null)
    }
  }

  const handleDelete = (id) => {
    deleteImage(id)
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white lg:pl-64 flex flex-col">
      <Sidebar role="admin" />
      
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 z-30 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight">Gallery Management</h1>
        <div className="flex items-center gap-4 text-xs text-white/40">
           <span>Total Assets: {images.length}</span>
           <span>•</span>
           <span>Last sync: Just now</span>
        </div>
      </header>

      <main className="p-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Upload Zone */}
           <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                 <Upload className="text-brand-primary" size={24} /> Upload New Assets
              </h2>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                className={`
                  relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300
                  ${dragActive ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                `}
              >
                 <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-brand-primary w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold mb-2 text-center">Drag and drop images here</h3>
                 <p className="text-white/40 text-sm mb-8 text-center max-w-sm">
                   Accepts PNG, JPG, or WEBP. Max file size 10MB. Recommended resolution 1920x1080.
                 </p>
                 <input 
                   type="file" 
                   className="hidden" 
                   id="file-upload" 
                   onChange={(e) => setSelectedFile(e.target.files[0])} 
                   accept="image/*"
                 />
                 <label htmlFor="file-upload" className="btn-glass px-8 cursor-pointer border-brand-primary/30 hover:bg-brand-primary/10">
                   {selectedFile ? selectedFile.name : 'Browse Files'}
                 </label>
                 
                 {dragActive && (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm rounded-3xl flex items-center justify-center pointer-events-none"
                   >
                     <p className="text-2xl font-black text-white">Drop to Upload</p>
                   </motion.div>
                 )}
              </div>
           </div>

           {/* Asset Details Form */}
           <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                 <Tag className="text-brand-secondary" size={24} /> Asset Details
              </h2>
              <GlassCard className="p-8 border-white/10 h-full flex flex-col">
                 <form onSubmit={handleUpload} className="space-y-6 flex-1">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-white/40 ml-1 tracking-widest">Image Title</label>
                       <input 
                         required
                         value={newImageData.title}
                         onChange={(e) => setNewImageData({...newImageData, title: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-white/20" 
                         placeholder="e.g. Tower A Night View" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-white/40 ml-1 tracking-widest">Category</label>
                       <select 
                         value={newImageData.category}
                         onChange={(e) => setNewImageData({...newImageData, category: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-brand-primary outline-none transition-all appearance-none"
                       >
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                    </div>
                    
                    <div className="mt-auto pt-8">
                       <button 
                         type="submit" 
                         disabled={uploading}
                         className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-3"
                       >
                          {uploading ? (
                             <><Loader2 className="animate-spin" size={20} /> Uploading...</>
                          ) : (
                             <><Plus size={20} /> Upload to Gallery</>
                          )}
                       </button>
                    </div>
                 </form>
              </GlassCard>
           </div>
        </div>

        {/* Management Grid */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                 <Filter className="text-brand-accent" size={24} /> Manage Gallery
              </h2>
              <div className="flex gap-2">
                 {['All', 'A-Blocks', 'B-Blocks', 'Amenites'].map(f => (
                    <button key={f} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/40 hover:text-white transition-all">
                       {f}
                    </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence>
                 {images.map((img) => (
                    <AssetCard 
                      key={img._id || img.id} 
                      img={img} 
                      onDelete={() => handleDelete(img._id || img.id)} 
                    />
                 ))}
              </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  )
}

function AssetCard({ img, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="group relative rounded-2xl overflow-hidden glass-card border-white/10 aspect-square"
    >
      <img 
        src={`http://localhost:5000${img.url}`} 
        alt={img.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      
      {/* Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform">
         <span className="text-[8px] font-black uppercase text-brand-primary tracking-widest mb-1 underline decoration-brand-primary/30">
            {img.category}
         </span>
         <h4 className="text-xs font-bold text-white truncate mb-4">{img.title}</h4>
         <div className="flex items-center gap-2">
            <button className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white/70 hover:text-white transition-all uppercase">
               Edit
            </button>
            <button 
              onClick={onDelete}
              className="w-8 h-8 rounded-lg bg-red-400/10 hover:bg-red-400 flex items-center justify-center text-red-500 hover:text-white transition-all"
            >
               <Trash2 size={14} />
            </button>
         </div>
      </div>

      {/* Checkmark indicator */}
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
         <CheckCircle2 size={14} className="text-white" />
      </div>
    </motion.div>
  )
}
