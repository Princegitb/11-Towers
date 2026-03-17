import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle, 
  Droplet, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Send,
  X,
  Trash2,
  Calendar,
  Zap,
  Shield,
  Building2
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import GlassCard from '../../components/GlassCard'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { complaints, fetchComplaints, usersOverview, addNotice, waterStatus, setWaterStatus } = useStore()
  
  const [noticeData, setNoticeData] = useState({ title: '', content: '', isHighPriority: false })
  
  const [newSchedule, setNewSchedule] = useState({
    targets: [],
    startTime: '',
    endTime: '',
    immediate: false
  })

  const towerOptions = [
    { id: 'All', label: 'Select All' },
    { id: 'Block A', label: 'Block A (A1-A4)' },
    { id: 'Block B', label: 'Block B (B1-B3)' },
    { id: 'Block C', label: 'Block C (C1-C4)' },
    { id: 'A1', label: 'A1' }, { id: 'A2', label: 'A2' }, { id: 'A3', label: 'A3' }, { id: 'A4', label: 'A4' },
    { id: 'B1', label: 'B1' }, { id: 'B2', label: 'B2' }, { id: 'B3', label: 'B3' },
    { id: 'C1', label: 'C1' }, { id: 'C2', label: 'C2' }, { id: 'C3', label: 'C3' }, { id: 'C4', label: 'C4' }
  ]

  const handleTargetToggle = (id) => {
    if (id === 'All') {
       if (newSchedule.targets.includes('All')) {
          setNewSchedule({ ...newSchedule, targets: [] })
       } else {
          setNewSchedule({ ...newSchedule, targets: ['All'] })
       }
       return
    }
    
    let updated = [...newSchedule.targets].filter(t => t !== 'All')
    if (updated.includes(id)) {
       updated = updated.filter(t => t !== id)
    } else {
       updated.push(id)
    }
    setNewSchedule({ ...newSchedule, targets: updated })
  }

  const handlePublishWater = (e) => {
    e.preventDefault()
    if (newSchedule.targets.length === 0) return toast.error("Select at least one target area")
    if (!newSchedule.immediate && (!newSchedule.startTime || !newSchedule.endTime)) return toast.error("Set timings or Turn ON Immediately")

    const schedule = {
      id: Date.now(),
      targets: newSchedule.targets.includes('All') ? ['A1','A2','A3','A4','B1','B2','B3','C1','C2','C3','C4'] : newSchedule.targets,
      startTime: newSchedule.immediate ? 'NOW' : newSchedule.startTime,
      endTime: newSchedule.immediate ? 'Until further notice' : newSchedule.endTime,
      timestamp: new Date().toISOString()
    }

    setWaterStatus([schedule, ...waterStatus])
    setNewSchedule({ targets: [], startTime: '', endTime: '', immediate: false })
  }

  const removeSchedule = (id) => {
    setWaterStatus(waterStatus.filter(s => s.id !== id))
  }

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [filterConfig, setFilterConfig] = useState({ block: 'All', status: 'All' })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredUsers = usersOverview.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.flat.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBlock = filterConfig.block === 'All' || user.flat.startsWith(filterConfig.block)
    const matchesStatus = filterConfig.status === 'All' || user.status === filterConfig.status
    return matchesSearch && matchesBlock && matchesStatus
  })
  
  React.useEffect(() => {
    fetchComplaints();
  }, [])
  
  const handleNoticeSubmit = (e) => {
    e.preventDefault();
    if(!noticeData.title || !noticeData.content) return;
    addNotice(noticeData);
    setNoticeData({ title: '', content: '', isHighPriority: false });
  }
  
  return (
    <div className="min-h-screen bg-dark-bg text-white lg:pl-64 flex flex-col">
      <Sidebar role="admin" />
      
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 z-30 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
              <Shield className="text-brand-primary" size={20} />
           </div>
           <div>
              <h2 className="font-black text-xl tracking-tight">Admin Console</h2>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                 <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Systems Online</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
              <MessageSquare size={20} />
           </button>
           <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
           <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold">Prince Shukla</p>
                 <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary p-0.5">
                 <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                    <Users size={18} className="text-brand-primary" />
                 </div>
              </div>
           </div>
        </div>
      </header>

      <main className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard label="Total Maintenance" value="₹12.4L" trend="+8% vs last month" icon={<TrendingUp size={20} className="text-green-400" />} />
           <StatCard label="Pending Complaints" value={(complaints || []).filter(c=>c?.status!=='Resolved').length} trend={`${(complaints || []).filter(c=>c?.status==='Pending').length} High Priority`} icon={<AlertCircle size={20} className="text-red-400" />} />
           <StatCard label="Active Residents" value={(usersOverview || []).length} trend="98% Login rate" icon={<Users size={20} className="text-brand-primary" />} />
           <StatCard label="Water Usage" value="4.2k L" trend="Normal levels" icon={<Droplet size={20} className="text-brand-accent" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Master Water Controller */}
           <GlassCard className="lg:col-span-2 p-8 border-white/10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold flex items-center gap-3">
                    <Droplet className="text-brand-primary" size={24} /> New Water Schedule
                 </h3>
              </div>

              <form onSubmit={handlePublishWater} className="space-y-6">
                 <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-3 block tracking-widest">Target Areas</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                       {towerOptions.map(opt => (
                          <button
                             type="button"
                             key={opt.id}
                             onClick={() => handleTargetToggle(opt.id)}
                             className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                newSchedule.targets.includes(opt.id)
                                ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                                : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                             }`}
                          >
                             {opt.label}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Start Time</label>
                       <input 
                          disabled={newSchedule.immediate}
                          type="time" 
                          value={newSchedule.startTime} 
                          onChange={e=>setNewSchedule({...newSchedule, startTime: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-30 transition-all" 
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] uppercase font-bold text-white/40 ml-1">End Time</label>
                       <input 
                          disabled={newSchedule.immediate}
                          type="time" 
                          value={newSchedule.endTime} 
                          onChange={e=>setNewSchedule({...newSchedule, endTime: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-30 transition-all" 
                       />
                    </div>
                    <div className="flex flex-col justify-end pb-1">
                       <button
                          type="button"
                          onClick={() => setNewSchedule({...newSchedule, immediate: !newSchedule.immediate})}
                          className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-all text-xs font-bold ${
                             newSchedule.immediate 
                             ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' 
                             : 'bg-white/5 border-white/10 text-white/40'
                          }`}
                       >
                          <Zap size={14} /> Turn ON Immediately
                       </button>
                    </div>
                 </div>

                 <button type="submit" className="btn-primary w-full py-4 font-black tracking-widest uppercase text-sm">
                    Publish Water Status
                 </button>
              </form>

              {/* Active Schedules Table */}
              <div className="mt-10 pt-8 border-t border-white/5">
                 <h4 className="text-sm font-bold text-white/60 mb-4 flex items-center gap-2">
                    <Clock size={16} /> Active/Upcoming Schedules
                 </h4>
                 <div className="overflow-hidden rounded-2xl border border-white/5">
                    <table className="w-full text-left text-xs">
                       <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-wider">
                          <tr>
                             <th className="px-6 py-4">Sectors</th>
                             <th className="px-6 py-4">Timing</th>
                             <th className="px-6 py-4">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {waterStatus.length === 0 ? (
                             <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-white/20 italic">No active water schedules found.</td>
                             </tr>
                          ) : waterStatus.map(s => (
                             <tr key={s.id} className="hover:bg-white/5 transition-all group">
                                <td className="px-6 py-5">
                                   <div className="flex flex-wrap gap-1">
                                      {s.targets.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px]">{t}</span>)}
                                      {s.targets.length > 4 && <span className="text-[10px] text-white/30">+{s.targets.length - 4} more</span>}
                                   </div>
                                </td>
                                <td className="px-6 py-5 font-bold">
                                   {s.startTime === 'NOW' ? <span className="text-orange-400 flex items-center gap-1"><Zap size={10}/> RUNNING</span> : `${s.startTime} - ${s.endTime}`}
                                </td>
                                <td className="px-6 py-5">
                                   <button onClick={() => removeSchedule(s.id)} className="p-2 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all">
                                      <Trash2 size={14} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </GlassCard>

           {/* Notice Publisher */}
           <GlassCard className="p-8 border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <Send className="text-brand-primary" size={20} /> Publish Notice
              </h3>
              <form onSubmit={handleNoticeSubmit} className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Notice Title</label>
                    <input value={noticeData.title} onChange={e=>setNoticeData({...noticeData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-primary" placeholder="Enter title..." />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Message Content</label>
                    <textarea value={noticeData.content} onChange={e=>setNoticeData({...noticeData, content: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px] outline-none focus:ring-1 focus:ring-brand-primary resize-none" placeholder="Type announcement..."></textarea>
                 </div>
                 <div className="flex items-center gap-3 mb-6">
                    <input type="checkbox" checked={noticeData.isHighPriority} onChange={e=>setNoticeData({...noticeData, isHighPriority: e.target.checked})} id="isHighPriority" className="w-4 h-4 bg-white/5 border border-white/10 rounded accent-brand-primary" />
                    <label htmlFor="isHighPriority" className="text-xs font-bold text-white/60">Mark as High Priority</label>
                 </div>
                 <button type="submit" className="btn-primary w-full py-4 font-bold">Post to Board</button>
              </form>
           </GlassCard>
        </div>

        {/* Complaint Management & User List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <GlassCard className="p-0 overflow-hidden border-white/10">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                 <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18} className="text-brand-secondary" /> Recent Complaints</h3>
                 <button className="btn-glass px-4 py-2 text-xs border-white/10">View All Tickets</button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto max-h-80">
                 {complaints.length === 0 ? <p className="text-white/40 text-sm">No complaints logged.</p> : complaints.map((c) => (
                   <ComplaintItem key={c._id} user={c.user?.name || "Resident"} block={c.tower + '-' + c.flatNumber} title={c.title} status={c.status} time={new Date(c.createdAt).toLocaleDateString()} id={c._id} />
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-0 overflow-hidden border-white/10">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                 <h3 className="font-bold flex items-center gap-2"><Users size={18} className="text-brand-accent" /> Residents Overview</h3>
                 <div className="flex gap-2">
                    <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} className={`p-2 rounded-lg border transition-all ${isSearchExpanded ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}><Search size={16} /></button>
                    <div className="relative">
                       <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`p-2 rounded-lg border transition-all ${isFilterOpen ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}><Filter size={16} /></button>
                       <AnimatePresence>
                          {isFilterOpen && (
                             <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 mt-2 w-48 bg-dark-bg/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50"
                             >
                                <div className="space-y-4">
                                   <div>
                                      <p className="text-[10px] uppercase font-bold text-white/40 mb-2">Filter by Block</p>
                                      <div className="grid grid-cols-2 gap-2">
                                         {['All', 'A', 'B', 'C'].map(b => (
                                            <button key={b} onClick={() => setFilterConfig({...filterConfig, block: b})} className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border ${filterConfig.block === b ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : 'bg-white/5 border-white/10 text-white/40'}`}>Block {b}</button>
                                         ))}
                                      </div>
                                   </div>
                                   <div>
                                      <p className="text-[10px] uppercase font-bold text-white/40 mb-2">Payment Status</p>
                                      <div className="flex flex-col gap-2">
                                         {['All', 'PAID', 'DUE'].map(s => (
                                            <button key={s} onClick={() => setFilterConfig({...filterConfig, status: s})} className={`px-3 py-2 rounded-lg text-[10px] font-bold border text-left flex items-center justify-between ${filterConfig.status === s ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-white/5 border-white/10 text-white/40'}`}>
                                               {s}
                                               {filterConfig.status === s && <CheckCircle2 size={10} />}
                                            </button>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>
              
              <AnimatePresence>
                 {isSearchExpanded && (
                    <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="px-6 border-b border-white/5 overflow-hidden"
                    >
                       <div className="relative py-4">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                          <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name or flat..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-white/20" />
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
              <div className="p-6 space-y-4">
                 {filteredUsers.length === 0 ? (
                   <div className="text-center py-10">
                      <p className="text-white/20 text-sm">No residents found matching criteria</p>
                      <button onClick={() => {setSearchQuery(''); setFilterConfig({block:'All', status:'All'})}} className="text-xs text-brand-primary mt-2 hover:underline">Clear all filters</button>
                   </div>
                 ) : filteredUsers.map((user) => (
                    <UserItem key={user.id} name={user.name} flat={user.flat} status={user.status} />
                 ))}
              </div>
           </GlassCard>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, trend, icon }) {
  return (
    <GlassCard className="p-6 border-white/10">
       <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
             {icon}
          </div>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{trend}</span>
       </div>
       <p className="text-sm font-bold text-white/50 mb-1">{label}</p>
       <p className="text-2xl font-black text-white">{value}</p>
    </GlassCard>
  )
}

function UserItem({ name, flat, status }) {
  const isPaid = status === 'PAID'
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
       <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-brand-primary transition-all group-hover:text-white">
             {name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
             <p className="text-xs font-bold">{name}</p>
             <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{flat}</p>
          </div>
       </div>
       <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${isPaid ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
          {status}
       </span>
    </div>
  )
}

function ComplaintItem({ id, user, block, title, status, time }) {
  const { updateStatus } = useStore() || {}
  
  const colors = {
     'Pending': 'text-red-400 bg-red-400/10 border-red-400/20',
     'In Progress': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
     'Resolved': 'text-green-400 bg-green-400/10 border-green-400/20'
  }

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all relative group">
       <div className="flex items-start justify-between gap-4 mb-2">
          <div>
             <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{block} • {user}</p>
             <h4 className="text-xs font-bold leading-tight">{title}</h4>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shrink-0 ${colors[status] || 'text-white bg-white/10'}`}>
             {status}
          </span>
       </div>
       <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] text-white/20 font-bold">{time}</span>
          <button className="text-[10px] text-brand-primary font-black uppercase tracking-widest hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
             Respond <ChevronRight size={10} />
          </button>
       </div>
    </div>
  )
}
