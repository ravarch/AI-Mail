import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Email, Session } from '../types';

const API_BASE = '/api';

export function useMailbox(session: Session | null) {
  const [emails, setEmails] = useState<Email[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);

  const fetchEmails = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/emails/${session.username}`);
      if (res.ok) {
        const data = await res.json();
        setEmails(data);
      }
    } catch (e) {
      console.error("Failed to fetch emails");
    }
  }, [session]);

  const connectWs = useCallback(() => {
    if (!session) return;
    
    // Close existing
    if (wsRef.current) wsRef.current.close();

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}${API_BASE}/ws?username=${session.username}`);
    
    ws.onopen = () => {
      console.log('WS Connected');
      // Clear any pending reconnects
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'NEW_EMAIL') {
        toast.info(`New email from ${msg.data.sender}`);
        fetchEmails();
      }
    };

    ws.onclose = () => {
      console.log('WS Closed, reconnecting in 3s...');
      reconnectTimeoutRef.current = setTimeout(connectWs, 3000) as unknown as number;
    };

    wsRef.current = ws;
  }, [session, fetchEmails]);

  useEffect(() => {
    if (session) {
      fetchEmails();
      connectWs();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on unmount
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [session, connectWs, fetchEmails]);

  return { emails, refresh: fetchEmails };
}
