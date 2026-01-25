import React from 'react';
import { Send, ExternalLink } from 'lucide-react';

export const TelegramBanner = ({ compact = false }: { compact?: boolean }) => {
  return (
    <a
      href="https://t.me/drkingbd"
      target="_blank"
      rel="noopener noreferrer"
      className={`group block w-full relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${compact ? 'bg-gradient-to-br from-[#0088cc] to-[#006699] p-4' : 'bg-white p-1'}`}
    >
      {!compact ? (
        // Full Banner Design
        <div className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 rounded-xl p-0.5">
          <div className="bg-white rounded-[10px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                <Send size={24} className="-ml-1 mt-1" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-bold text-slate-800 text-lg">Join DrKingBD Community</h3>
                <p className="text-slate-500 text-sm">Get premium tools, updates & support</p>
              </div>
            </div>
            <div className="px-6 py-2 bg-[#0088cc] text-white rounded-full font-semibold text-sm flex items-center gap-2 group-hover:bg-[#0077b5] transition-colors">
              Join Channel <ExternalLink size={14} />
            </div>
          </div>
        </div>
      ) : (
        // Compact/Mobile Sidebar Design
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
             <Send size={16} className="-ml-0.5 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">DrKingBD Official</p>
            <p className="text-xs text-blue-100 truncate">Join for updates</p>
          </div>
        </div>
      )}
    </a>
  );
};
