import React from 'react';
import { Shield, User, Copy, Inbox, X, LogOut } from 'lucide-react';
import { Session, Email } from '../types';
import { TelegramBanner } from './TelegramBanner';
import { toast } from 'sonner';

interface SidebarProps {
  session: Session;
  emailCount: number;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onInboxClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  session, emailCount, isOpen, onClose, onLogout, onInboxClick 
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl md:shadow-none md:relative transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            AI Mail
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
           {/* Credentials Card */}
           <div className="bg-slate-900 text-slate-300 p-4 rounded-xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={60} />
              </div>
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Current Identity</p>
                <div className="flex items-center gap-2 text-white font-mono text-sm font-medium">
                  <User size={14} className="text-blue-400"/> {session.username}
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-2 flex items-center justify-between border border-white/10 mb-2">
                <span className="text-xs truncate font-mono text-slate-400 w-full">{session.address}</span>
                <button 
                  onClick={() => copyToClipboard(session.address, 'Address')}
                  className="hover:text-white transition-colors pl-2"
                >
                  <Copy size={14}/>
                </button>
              </div>
              {session.password && (
                 <div className="bg-black/30 rounded-lg p-2 flex items-center justify-between border border-white/10">
                   <span className="text-xs truncate font-mono text-slate-400 w-full">Pass: {session.password}</span>
                   <button 
                     onClick={() => copyToClipboard(session.password || '', 'Password')}
                     className="hover:text-white transition-colors pl-2"
                   >
                     <Copy size={14}/>
                   </button>
                 </div>
              )}
           </div>

           <nav className="space-y-1">
             <button 
               onClick={onInboxClick}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 transition-all"
             >
               <Inbox size={18} /> Inbox 
               <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold">
                 {emailCount}
               </span>
             </button>
           </nav>

           <div className="pt-4 border-t border-slate-100">
             <TelegramBanner compact />
           </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button onClick={onLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors w-full px-2 py-2">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
