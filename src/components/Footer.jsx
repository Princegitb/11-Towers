import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    
    // Check if we are on a dashboard page to apply sidebar padding
    const isDashboard = location.pathname.includes('dashboard');

    return (
        <footer className={`w-full py-10 border-t border-white/5 bg-dark-bg/80 backdrop-blur-xl z-30 transition-all duration-300 ${isDashboard ? 'lg:pl-64' : ''}`}>
            <div className="container mx-auto px-6 flex flex-col items-center justify-center space-y-2">
                <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.3em] mb-1">
                    Society Management System
                </p>
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
                    Designed by <span className="text-brand-primary font-black tracking-normal normal-case ml-1 relative">
                        PRINCE SHUKLA
                        <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-brand-primary/30 blur-[1px]"></span>
                    </span>
                </p>
                <div className="flex items-center gap-4 mt-4 opacity-20">
                    <div className="h-[1px] w-8 bg-white/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                    <div className="h-[1px] w-8 bg-white/50"></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
