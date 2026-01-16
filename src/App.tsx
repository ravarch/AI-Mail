import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, Send, Sparkles, Archive, AlertCircle, 
  Search, Menu, X, ChevronRight, RefreshCw 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// --- TYPES ---
interface Email {
  id: string;
  sender_name: string;
  sender_address: string;
  subject: string;
  summary: string;
  category: 'Work' | 'Personal' | 'Urgent' | 'Newsletter' | 'Spam';
  received_at: number;
  sentiment_score: number;
  is_read: number;
  body_text?: string;
  suggested_reply?: string;
  action_items?: string; // JSON string
}

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Emails
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emails');
      const data = await res.json();
      setEmails(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchEmails(); }, []);

  const openEmail = async (id: string) => {
    // Optimistic update
    const cached = emails.find(e => e.id === id);
    if (cached) setSelectedEmail(cached);

    try {
      const res = await fetch(`/api/emails/${id}`);
      const data = await res.json();
      setSelectedEmail(data);
      // Mark read in list
      setEmails(prev => prev.map(e => e.id === id ? { ...e, is_read: 1 } : e));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-indigo-500/30">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-[#0f0f0f] flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">RavArch AI</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem icon={<Inbox />} label="Inbox" count={emails.filter(e => !e.is_read).length} active />
          <NavItem icon={<Send />} label="Sent" />
          <NavItem icon={<Archive />} label="Archived" />
          <NavItem icon={<AlertCircle />} label="Spam" />
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-xl">
              <p className="text-xs text-indigo-300 font-medium mb-1">AI Usage</p>
              <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[65%]"></div>
              </div>
           </div>
        </div>
      </aside>

      {/* --- EMAIL LIST --- */}
      <div className="w-full md:w-96 border-r border-white/5 flex flex-col bg-[#0a0a0a]">
        <div className="h-16 border-b border-white/5 flex items-center px-4 justify-between">
          <h2 className="font-semibold text-sm">Inbox</h2>
          <button onClick={fetchEmails} className="p-2 hover:bg-white/5 rounded-full transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {emails.map(email => (
            <div 
              key={email.id}
              onClick={() => openEmail(email.id)}
              className={`p-4 border-b border-white/5 cursor-pointer transition hover:bg-white/[0.02] ${selectedEmail?.id === email.id ? 'bg-indigo-500/10 border-indigo-500/20' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${!email.is_read ? 'text-white' : 'text-gray-400'}`}>
                  {email.sender_name || email.sender_address}
                </span>
                <span className="text-xs text-gray-500">{formatDistanceToNow(email.received_at)} ago</span>
              </div>
              <h3 className={`text-sm mb-1 truncate ${!email.is_read ? 'font-semibold text-gray-200' : 'text-gray-500'}`}>
                {email.subject}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {email.summary || "Generating summary..."}
              </p>
              
              <div className="mt-3 flex gap-2">
                <Badge type={email.category} />
                {email.sentiment_score < -0.3 && <Badge type="Negative" color="red" />}
                {email.sentiment_score > 0.6 && <Badge type="Positive" color="emerald" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- EMAIL DETAIL VIEW --- */}
      <div className="flex-1 flex flex-col bg-[#0f0f0f]">
        {selectedEmail ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f0f0f]">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold truncate max-w-md">{selectedEmail.subject}</h1>
                <Badge type={selectedEmail.category} />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition">
                  Reply
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-8">
                
                {/* AI Insight Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 rounded-2xl bg-indigo-950/10 border border-indigo-500/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <div className="space-y-4 w-full">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">AI Summary</h4>
                        <p className="text-indigo-100/80 leading-relaxed text-sm">{selectedEmail.summary}</p>
                      </div>
                      
                      {selectedEmail.action_items && JSON.parse(selectedEmail.action_items).length > 0 && (
                        <div className="bg-black/20 rounded-lg p-4">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Action Items</h4>
                          <ul className="list-disc list-inside text-sm text-indigo-100/70 space-y-1">
                            {JSON.parse(selectedEmail.action_items).map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedEmail.suggested_reply && (
                        <div>
                          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Suggested Reply</h4>
                          <div className="text-sm text-indigo-100/60 italic border-l-2 border-indigo-500/30 pl-3">
                            "{selectedEmail.suggested_reply}"
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Sender Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-medium">
                    {selectedEmail.sender_name?.[0] || selectedEmail.sender_address[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white">{selectedEmail.sender_name}</div>
                    <div className="text-sm text-gray-500">{selectedEmail.sender_address}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-gray-300">
                  <div className="whitespace-pre-wrap font-light leading-7">
                    {selectedEmail.body_text}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 opacity-50" />
            </div>
            <p>Select an email to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components for styling
const NavItem = ({ icon, label, count, active }: any) => (
  <button className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {React.cloneElement(icon, { size: 18 })}
      <span>{label}</span>
    </div>
    {count > 0 && <span className="text-xs font-medium bg-indigo-600 text-white px-1.5 py-0.5 rounded-md">{count}</span>}
  </button>
);

const Badge = ({ type, color }: any) => {
  const styles: any = {
    Work: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Personal: "bg-green-500/10 text-green-400 border-green-500/20",
    Urgent: "bg-red-500/10 text-red-400 border-red-500/20",
    Spam: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    Newsletter: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Negative: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  };
  const defaultStyle = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  
  return (
    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${color ? styles[type] || defaultStyle : styles[type] || defaultStyle}`}>
      {type}
    </span>
  );
};

export default App;
