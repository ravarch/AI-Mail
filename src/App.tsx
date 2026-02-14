import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { Menu, Shield } from 'lucide-react';

import { useAuth } from './hooks/useAuth';
import { useMailbox } from './hooks/useMailbox';
import { Email } from './types';

import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { EmailDetail } from './components/EmailDetail';
import { InboxList } from './components/InboxList'; // *Assumed implemented similar to original list*

export default function App() {
  const { session, loading, generateIdentity, login, logout } = useAuth();
  const { emails, refresh } = useMailbox(session);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If no session, show Login
  if (!session) {
    return (
      <>
        <Toaster position="top-center" theme="dark" />
        <LoginView onGenerate={generateIdentity} onLogin={login} loading={loading} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
      <Toaster position="top-right" richColors />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-40 border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span>AI Mail</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      <Sidebar 
        session={session}
        emailCount={emails.length}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={logout}
        onInboxClick={() => { setSelectedEmail(null); setMobileMenuOpen(false); }}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50 pt-16 md:pt-0">
        {selectedEmail ? (
          <EmailDetail 
            email={selectedEmail} 
            username={session.username} 
            onBack={() => setSelectedEmail(null)} 
          />
        ) : (
          <InboxList 
            emails={emails} 
            onSelect={setSelectedEmail} 
            onRefresh={refresh} 
          />
        )}
      </main>
    </div>
  );
}

// Minimal InboxList implementation for completeness
function InboxList({ emails, onSelect, onRefresh }: { emails: Email[], onSelect: (e: Email) => void, onRefresh: () => void }) {
  // *Re-use the list rendering logic from your original App.tsx here, 
  // but use the typed 'emails' prop*
  
  // Placeholder structure:
  return (
    <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center z-10">
           <h2 className="text-lg md:text-2xl font-bold text-slate-800">Incoming Messages</h2>
           <button onClick={onRefresh} className="...">...</button>
        </header>
        <div className="p-4 md:p-8 space-y-3 max-w-5xl mx-auto">
            {emails.map(email => (
                <div key={email.id} onClick={() => onSelect(email)} className="...">
                   {/* Render Email Row */}
                   <div className="font-bold">{email.sender}</div>
                   <div>{email.subject}</div>
                </div>
            ))}
        </div>
    </div>
  );
}
