import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Paperclip, FileText, Send, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Email, FullEmail } from '../types';

interface EmailDetailProps {
  email: Email;
  username: string;
  onBack: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, username, onBack }) => {
  const [fullEmail, setFullEmail] = useState<FullEmail | null>(null);
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/email/${email.id}`).then(r => r.json()).then(setFullEmail);
  }, [email.id]);

  const handleReply = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reply`, {
        method: 'POST',
        body: JSON.stringify({
          username,
          replyTo: email.sender,
          subject: email.subject,
          body: replyBody
        })
      });
      if(!res.ok) throw new Error();
      toast.success('Reply sent successfully');
      setReplying(false);
      setReplyBody("");
    } catch (e) {
      toast.error('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const parseContent = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return { text: "Error parsing email content" };
    }
  };

  const content = fullEmail?.raw_content ? parseContent(fullEmail.raw_content) : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-white animate-in slide-in-from-right-10 duration-300">
      {/* Header */}
      <div className="h-16 border-b border-slate-100 px-4 md:px-6 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <h2 className="font-semibold text-slate-800 truncate">{email.subject}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
           {/* AI Insight */}
           {email.ai_summary && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden"
             >
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Zap size={120} />
               </div>
               <div className="flex items-center gap-2 text-blue-700 font-bold mb-3 uppercase text-xs tracking-wider">
                 <Zap size={14} /> AI Analysis
               </div>
               <p className="text-slate-700 leading-relaxed font-medium relative z-10">{email.ai_summary}</p>
             </motion.div>
           )}

           {/* Sender Info */}
           <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">
               {email.sender[0].toUpperCase()}
             </div>
             <div>
               <div className="font-bold text-slate-900">{email.sender}</div>
               <div className="text-sm text-slate-500">{new Date(email.created_at * 1000).toLocaleString()}</div>
             </div>
           </div>

           {/* Body */}
           <div className="prose prose-slate max-w-none">
             {content ? (
               <div className="bg-white rounded-xl text-slate-800 whitespace-pre-wrap">
                 {content.text || content.html}
                 {content.attachments?.length > 0 && (
                   <div className="mt-8 pt-8 border-t border-slate-100">
                     <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                       <Paperclip size={18} /> Attachments
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {content.attachments.map((att: any, i: number) => (
                         <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                           <FileText className="text-slate-400" />
                           <div className="truncate text-sm font-medium">{att.filename}</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             ) : (
               <div className="space-y-4 animate-pulse">
                 <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-100 rounded w-full"></div>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 md:p-6 z-10">
        <AnimatePresence>
          {!replying ? (
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setReplying(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 shadow-sm rounded-xl text-slate-700 font-bold hover:border-blue-400 hover:text-blue-600 transition-all mx-auto"
            >
              <Send size={18} /> Reply
            </motion.button>
          ) : (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-4xl mx-auto bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden"
            >
              <textarea
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
                className="w-full h-32 p-4 resize-none outline-none text-slate-800"
                placeholder="Type your secure reply here..."
                autoFocus
              />
              <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Shield size={10} /> ENCRYPTED
                </span>
                <div className="flex gap-3">
                  <button onClick={() => setReplying(false)} className="px-4 py-2 text-slate-500 font-medium text-sm">Cancel</button>
                  <button onClick={handleReply} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50">
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
