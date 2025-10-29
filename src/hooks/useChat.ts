'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ChatMessageType } from '@/lib/interfaces';


interface UseChatReturn {
  messages: ChatMessageType[];
  sendMessage: (message: string) => void;
  clearHistory: () => void;
  isConnected: boolean;
  isTyping: boolean;
  error: string | null;
  reconnect: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const { getToken } = useAuth();
  const isConnecting = useRef(false);
  const isMounted = useRef(true); 

  const cleanup = useCallback(() => {
    // clear reconnect timeout
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    // close WebSocket connection
    if (ws.current) {
      // Remove event handlers to prevent callbacks after cleanup
      ws.current.onopen = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.onmessage = null;
      
      if (ws.current.readyState === WebSocket.OPEN || 
          ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.close(1000, 'Cleaning up connection');
      }
      
      ws.current = null;
    }
    
    isConnecting.current = false;
  }, []);

  const connect = useCallback(async () => {

    // Prevent duplicate connections
    if (isConnecting.current) {
      console.log('Already connecting, skipping connection');
      return;
    }
    // don't connect if component is unmounted
    if (!isMounted.current) {
      console.log('Component unmounted, skipping connection');
      return;
    }

    try {
      isConnecting.current = true;
      const token = await getToken();
      if (!token) {
        setError('Not authenticated');
        isConnecting.current = false;
        return;
      }

      // clean up any existing connection
      cleanup();

      const wsUrl = `ws://localhost:8000/ws/chat/?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        if (!isMounted.current) 
          return;
        
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        isConnecting.current = false;
      };


      ws.current.onmessage = (event) => {
         if (!isMounted.current) 
          return;
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };
    

      ws.current.onerror = (event) => {
        if (!isMounted.current) 
          return;
        console.error('WebSocket error:', event);
        setError('Connection error');
        isConnecting.current = false;
      };

      ws.current.onclose = (event) => {
        if (!isMounted.current) 
          return;
        console.log('WebSocket closed:', event.code);
        setIsConnected(false);
        isConnecting.current = false;
        
      // auto reconnect after 3 seconds only if mounted + not already reconnecting + not normal closure
      if (event.code !== 1000 && isMounted.current && !reconnectTimeout.current) {
        reconnectTimeout.current = setTimeout(() => {
          reconnectTimeout.current = null;
          if (isMounted.current) {
            console.log('Attempting to reconnect...');
            connect();
          }
        }, 3000);
      }
    };


    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect');
      isConnecting.current = false;
    }
  }, [getToken, cleanup]);


  const handleMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'history':
        console.log(`loading ${data.messages.length} messages from history`);
        setMessages(data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })));
        data.messages.at(-1)?.role === 'user' ? setIsTyping(true) : setIsTyping(false);
        break;

      case 'system':
        setMessages(prev => [...prev, {
          id: `system-${Date.now()}-${Math.random()}`,
          role: 'system',
          content: data.message,
          timestamp: data.timestamp || new Date().toISOString()
        }]);
        break;

      case 'bot':
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}-${Math.random()}`,
          role: 'bot',
          content: data.message,
          timestamp: data.timestamp || new Date().toISOString()
        }]);
        break;

      case 'history_cleared':
        // clear messages
        setMessages([]);
        setIsTyping(false)
        console.log(data.message);
        break;

      case 'typing':
        setIsTyping(data.is_typing);
        break;

      case 'error':
        setError(data.message);
        setIsTyping(false);
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError('Not connected to chat');
      return;
    }

    // Add user message to UI
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Send to backend
    ws.current.send(JSON.stringify({
      type: 'message',
      message: content
    }));

    setError(null);

}, []);


const clearHistory = useCallback(() => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError('not connected to chat');
      return;
    }

    // send clear history request to backend
    ws.current.send(JSON.stringify({
      type: 'clear_history'
    }));
  }, []);

  const reconnect = useCallback(() => {
    console.log('manual reconnect');
    cleanup();
    connect();
  }, [connect, cleanup]);

  // connect on mount
  useEffect(() => {
    console.log('useChat hook mounted');
    isMounted.current = true;
    connect();

    // cleanup on unmount
    return () => {
      console.log('useChat hook unmounting');
      isMounted.current = false;
      cleanup();
    };
  }, [connect, cleanup]);

  return {
    messages,
    sendMessage,
    clearHistory,
    isConnected,
    isTyping,
    error,
    reconnect
  };
}