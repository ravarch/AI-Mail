import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, Zap, Lock, Mail } from 'lucide-react';
import { TelegramBanner } from './TelegramBanner';

interface LoginViewProps {
  onGenerate: () => void;
  onLogin: (u: string, p: string) => void;
  loading: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onGenerate, onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4 relative overflow-y-auto overflow-x-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex items-center justify-center z-10 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl w-full grid md:grid-cols-2 gap-8 md:gap-12"
        >
          {/* Form */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
            <div className="space-y-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                <Shield className="text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
                AI Secure Mail
              </h1>
              <p className="text-slate-400">Professional, ephemeral email service powered by AI.</p>
            </div>
            
            <button
              onClick={onGenerate}
              disabled={loading}
              className="group w-full py-4 bg-white text-slate-950 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3 mb-6 disabled:opacity-70"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Zap className="text-blue-600" />}
              Generate Identity
            </button>

            <div className="flex items-center gap-4 text-slate-600 mb-6">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-xs font-bold tracking-wider">EXISTING USER</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                onClick={() => onLogin(username, password)}
                disabled={loading}
                className="w-full py-3 bg-slate-800 text-blue-400 font-semibold rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Access Inbox
              </button>
            </div>
            <div className="mt-8 md:hidden">
              <TelegramBanner />
            </div>
          </div>

          {/* Marketing Copy */}
          <div className="hidden md:flex flex-col justify-center space-y-8 order-1 md:order-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-transparent rounded-3xl p-8 border border-slate-800/50 backdrop-blur-md">
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full" />
                 <Mail size={60} className="text-blue-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Intelligent Privacy</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Incoming emails are automatically analyzed by <strong>Llama-3</strong> to give you instant context without opening suspicious messages.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                  <Lock className="w-6 h-6 text-emerald-400 mb-2" />
                  <div className="text-xs font-medium text-slate-300">End-to-End Secure</div>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                  <Zap className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="text-xs font-medium text-slate-300">WebSocket Live</div>
                </div>
              </div>
            </div>
            <TelegramBanner />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
