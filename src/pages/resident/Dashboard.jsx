import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, User, Droplet, CreditCard, MessageSquare, Phone, Calendar, ArrowUpRight, Shield, Zap, Building2 } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import GlassCard from '../../components/GlassCard'
import useStore from '../../store/useStore'

export default function ResidentDashboard() {
  const { user, notices, maintenanceBills, addComplaint, syncNotices, waterStatus, syncWaterStatus } = useStore()
  
  React.useEffect(() => {
    syncNotices();
    syncWaterStatus();

    const handleSync = () => syncWaterStatus();
    window.addEventListener('waterUpdated', handleSync);
    window.addEventListener('storage', (e) => {
       if (e.key === '11towers_water_status') handleSync();
    });
    return () => {
       window.removeEventListener('waterUpdated', handleSync);
    };
  }, [syncNotices, syncWaterStatus]);
  
  const [complaintData, setComplaintData] = React.useState({ category: 'Plumbing', urgency: 'Medium', description: '' })

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintData.description) return;
    addComplaint({
       title: complaintData.description.substring(0, 30) + '...',
       description: complaintData.description,
       category: complaintData.category,
       status: 'Pending',
       tower: currentUser.tower,
       flatNumber: currentUser.flatNumber
    });
    setComplaintData({ category: 'Plumbing', urgency: 'Medium', description: '' });
  }

  const currentUser = user || { name: 'Aaryan Sharma', tower: 'A2', flatNumber: '402' }
  
  return (
    <div className="min-h-screen bg-dark-bg text-white lg:pl-64 flex flex-col">
      <Sidebar role="resident" />
      
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 z-30 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="Search features, notices..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-xl hover:bg-white/5 transition-all group">
            <Bell size={22} className="text-white/60 group-hover:text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full neon-glow-cyan"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{currentUser.name}</p>
              <p className="text-xs text-white/40">Tower {currentUser.tower} | Flat {currentUser.flatNumber}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary p-0.5">
              <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                <User size={20} className="text-brand-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden p-10 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-brand-primary/20 via-brand-secondary/10 to-transparent border border-white/10"
        >
          <div className="z-10 mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Good Morning, {currentUser.name.split(' ')[0]}! 👋</h1>
            <p className="text-white/60 max-w-lg mb-6">Everything looks good today. Your maintenance is paid and the next water pump cycle starts in 2 hours.</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <Calendar size={16} className="text-brand-primary" />
                <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <Building2 size={16} className="text-brand-secondary" />
                <span className="text-sm font-medium">11 Towers • {currentUser.tower}</span>
              </div>
            </div>
          </div>
          
          {/* Decorative stats */}
          <div className="flex gap-4 z-10">
             <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center w-28">
                <p className="text-2xl font-bold text-brand-primary">0</p>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Tickets</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center w-28">
                <p className="text-2xl font-bold text-green-400">PAID</p>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Status</p>
             </div>
          </div>

          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none"></div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Digital Notice Board */}
          <GlassCard className="col-span-1 md:col-span-2 lg:col-span-1 p-0 flex flex-col border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2"><Bell size={18} className="text-brand-primary" /> Digital Notice Board</h3>
              <button className="text-xs text-brand-primary hover:underline">View All</button>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-64">
              {notices.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 py-8">
                  <Send size={24} className="mb-2" />
                  <p className="text-sm">No new notices today</p>
                </div>
              ) : notices.map((n) => (
                <NoticeItem 
                  key={n.id}
                  title={n.title} 
                  time={new Date(n.date || n.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                  urgent={n.isHighPriority || n.urgent}
                  content={n.content}
                />
              ))}
            </div>
          </GlassCard>

          {/* Smart Water Schedule */}
          <GlassCard className="flex flex-col border-white/10 overflow-hidden p-0">
             <div className="p-6 border-b border-white/5 flex items-center justify-between bg-brand-primary/5">
                <h3 className="font-bold flex items-center gap-2"><Droplet size={18} className="text-brand-primary" /> Water Schedule</h3>
                <span className="px-2 py-1 rounded-full bg-green-400/20 text-green-400 text-[10px] font-bold uppercase">Tower {currentUser.tower}</span>
             </div>
             <div className="p-8 text-center flex-1 flex flex-col justify-center">
                {(() => {
                   const myTower = currentUser?.tower || ""; 
                   const myBlock = myTower ? `Block ${myTower[0]}` : ""; 
                   const activeSchedule = (waterStatus || []).find(s => 
                      (myTower && s.targets && s.targets.includes(myTower)) || 
                      (myBlock && s.targets && s.targets.includes(myBlock)) ||
                      (s.targets && s.targets.includes('All'))
                   );

                   if (activeSchedule) {
                      return (
                         <div className="space-y-6">
                            <div className="flex flex-col items-center">
                               <div className="w-20 h-20 rounded-full bg-green-400/10 border-4 border-green-400/20 flex items-center justify-center mb-4 relative">
                                  <Droplet size={32} className="text-green-400 animate-bounce" style={{ animationDuration: '2s' }} />
                                  <motion.div 
                                     animate={{ scale: [1, 1.2, 1] }}
                                     transition={{ repeat: Infinity, duration: 2 }}
                                     className="absolute inset-0 rounded-full border border-green-400/40"
                                  />
                               </div>
                               <p className="text-green-400 font-extrabold text-lg uppercase tracking-widest">Water is ON</p>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                               <div className="text-left">
                                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Scheduled Duration</p>
                                  <p className="font-black text-white">
                                     {activeSchedule.startTime === 'NOW' ? 'STARTED NOW' : activeSchedule.startTime} 
                                     {' — '} 
                                     {activeSchedule.endTime}
                                  </p>
                               </div>
                               <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                                  <Zap size={20} className="text-brand-primary" />
                               </div>
                            </div>
                         </div>
                      );
                   } else {
                      return (
                         <div className="space-y-6 opacity-50">
                            <div className="flex flex-col items-center">
                               <div className="w-20 h-20 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center mb-4">
                                  <Droplet size={32} className="text-white/20" />
                               </div>
                               <p className="text-white/40 font-extrabold text-sm uppercase tracking-widest">No Active Schedule</p>
                            </div>
                            <p className="text-xs text-white/20 px-4">Water is currently OFF for {myTower || 'your tower'}. Please check back later for announcements.</p>
                         </div>
                      );
                   }
                })()}
             </div>
          </GlassCard>

          {/* Maintenance Portal */}
          <GlassCard className="p-0 border-white/10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2"><CreditCard size={18} className="text-brand-secondary" /> Maintenance</h3>
              <span className="text-xs text-green-400 flex items-center gap-1 font-bold">● No Dues</span>
            </div>
            <div className="p-6 space-y-6 flex-1 flex flex-col">
              <div className="flex items-end justify-between">
                <div>
                   <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Current Bill (March)</p>
                   <p className="text-3xl font-extrabold">₹3,450.00</p>
                </div>
                <div className="px-3 py-1 bg-green-400/10 border border-green-400/20 text-green-400 rounded-lg text-xs font-bold">
                   PAID
                </div>
              </div>
              
              <div className="space-y-3">
                 <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Recent History</p>
                 {maintenanceBills.map(bill => (
                   <HistoryItem key={bill.id} month={bill.month} amount={`₹${bill.amount}`} date={bill.date} />
                 ))}
              </div>

              <div className="mt-auto">
                 <button className="btn-glass w-full border-brand-secondary/30 hover:border-brand-secondary/60">
                   Manage Payments <ArrowUpRight size={18} />
                 </button>
              </div>
            </div>
          </GlassCard>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Complaint Helpdesk */}
           <GlassCard className="p-8 border-white/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <MessageSquare className="text-brand-primary" /> Raise a Complaint
              </h3>
              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-white/40 uppercase ml-1">Category</label>
                       <select value={complaintData.category} onChange={e=>setComplaintData({...complaintData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-primary">
                          <option>Plumbing</option>
                          <option>Electrical</option>
                          <option>Security</option>
                          <option>Cleaning</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-white/40 uppercase ml-1">Urgency</label>
                       <select value={complaintData.urgency} onChange={e=>setComplaintData({...complaintData, urgency: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-primary">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High (Urgent)</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase ml-1">Description</label>
                    <textarea 
                      value={complaintData.description}
                      onChange={e=>setComplaintData({...complaintData, description: e.target.value})}
                      placeholder="Describe your issue in detail..." 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px] outline-none focus:ring-1 focus:ring-brand-primary resize-none"
                    ></textarea>
                 </div>
                 <button type="submit" className="btn-primary w-full py-4 text-base">Submit Ticket</button>
              </form>
           </GlassCard>

           {/* Emergency Directory */}
           <GlassCard className="p-8 border-white/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Phone className="text-brand-secondary" /> Emergency Directory
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <EmergencyButton label="Guard Desk" icon={<Shield size={20} />} phone="Ext. 001" color="cyan" />
                 <EmergencyButton label="Electrician" icon={<Zap size={20} />} phone="+91 98765-XXXXX" color="purple" />
                 <EmergencyButton label="Plumber" icon={<Droplet size={20} />} phone="+91 87654-XXXXX" color="cyan" />
                 <EmergencyButton label="Main Office" icon={<Building2 size={20} />} phone="+91 76543-XXXXX" color="purple" />
              </div>
              <div className="mt-8 p-4 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-red-400 flex items-center justify-center text-white shrink-0">
                    <Phone size={24} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-red-400">AMBULANCE / FIRE</p>
                    <p className="text-lg font-bold">102 / 101</p>
                 </div>
              </div>
           </GlassCard>
        </div>
      </main>
    </div>
  )
}

function NoticeItem({ title, time, content, urgent }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all hover:bg-white/5 ${urgent ? 'border-brand-primary/20 bg-brand-primary/5' : 'border-white/5 bg-white/5'}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-sm">{title}</h4>
        <span className="text-[10px] text-white/40 uppercase font-bold">{time}</span>
      </div>
      <p className="text-xs text-white/60 leading-relaxed">{content}</p>
    </div>
  )
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-brand-primary mb-2 shadow-inner">
        {value}
      </div>
      <span className="text-[10px] font-bold text-white/40 tracking-widest">{label}</span>
    </div>
  )
}

function HistoryItem({ month, amount, date }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
       <div>
          <p className="text-sm font-bold">{month}</p>
          <p className="text-[10px] text-white/40 uppercase font-bold">{date}</p>
       </div>
       <p className="text-sm font-bold">{amount}</p>
    </div>
  )
}

function EmergencyButton({ label, icon, phone, color }) {
  const isCyan = color === 'cyan'
  return (
    <motion.button 
      whileHover={{ y: -4 }}
      className={`p-4 rounded-2xl border flex flex-col items-center text-center group transition-all ${
        isCyan 
          ? 'bg-brand-primary/5 border-brand-primary/20 hover:border-brand-primary/50' 
          : 'bg-brand-secondary/5 border-brand-secondary/20 hover:border-brand-secondary/50'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
        isCyan ? 'bg-brand-primary/20 text-brand-primary group-hover:scale-110' : 'bg-brand-secondary/20 text-brand-secondary group-hover:scale-110'
      }`}>
        {icon}
      </div>
      <p className="text-xs font-bold mb-0.5">{label}</p>
      <p className="text-[10px] text-white/40 font-bold">{phone}</p>
    </motion.button>
  )
}
