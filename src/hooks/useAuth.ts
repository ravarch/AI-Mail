import { useState } from 'react';
import { toast } from 'sonner';
import { Session } from '../types';

const API_BASE = '/api';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const generateIdentity = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, { method: 'POST' });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setSession(data);
      toast.success('New Identity Generated');
      return data;
    } catch (e) {
      toast.error('Failed to generate identity');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, { 
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      setSession(data);
      toast.success('Welcome back');
      return data;
    } catch (e) {
      toast.error('Invalid credentials');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    toast.info('Signed out');
  };

  return { session, loading, generateIdentity, login, logout };
}
