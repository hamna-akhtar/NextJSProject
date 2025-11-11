'use client';

import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useChat } from '@/hooks/useChat';
import { Loader2, AlertCircle, RefreshCw, Sparkles, Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const { 
    messages, 
    sendMessage, 
    clearHistory,
    isConnected, 
    isTyping, 
    error,
    reconnect 
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  // auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Input handlers
  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && isConnected) {
      sendMessage(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    clearHistory();
  };

    const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };


  return (
    <div className="w-screen min-h-screen antialiased flex items-center justify-center bg-black">
      <div className="flex flex-col w-[80%] max-w-7xl bg-white shadow-2xl rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-600 text-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Chatbot</h1>
                <p className="text-sm text-blue-100">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Clear Chat Button */}
              {messages?.length > 0 && (
                <button
                  onClick={() => openModal("clear_chat_modal")}
                  className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear Chat</span>
                </button>
              )}

              {/* Reconnect Button */}
              {!isConnected && (
                <button
                  onClick={reconnect}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Clear Confirmation Modal */}
        <dialog id="clear_chat_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-zinc-800">
            <p className="py-4 font-bold text-xl text-neutral-300">
              Are you sure you want to clear all chat history?
            </p>
            <div className="modal-action">
              <form method="dialog" className="flex flex-row gap-2">
                <button
                  onClick={handleClearHistory}
                  className="btn btn-ghost hover:btn-error text-lg rounded-lg"
                >
                  Yes
                </button>
                <button className="btn btn-ghost text-lg rounded-lg">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </dialog>


        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-3">
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[500px] max-h-[600px] bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
                  <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to Your AI Assistant
                  </h2>
                  <p className="text-gray-600 mb-4">
                    I have access to all your journals, tasks, and profile. Ask me anything!
                  </p>
                  <div className="text-left space-y-2">
                    <p className="text-sm text-gray-500">Try asking:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• "What's my latest journal entry?"</li>
                      <li>• "What is my top pending task?"</li>
                      <li>• "Have i received any friend requests?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              const isBot = message.role === 'bot';
              // const isSystem = message.role === 'system';

              return (
                <div
                  key={index}
                  className={cn(
                    'flex w-full mb-4',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      isUser && 'bg-emerald-700 text-gray-50',
                      isBot && 'bg-stone-100 text-zinc-800 border border-gray-200',
                      // isSystem && 'text-sm'
                    )}
                  >
                    {/* Message content */}
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>

                    {/* Timestamp */}
                    <div
                      className={cn(
                        'text-xs mt-1 opacity-70',
                        isUser ? 'text-gray-300' : 'text-gray-500'
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-gray-600 text-sm">Thinking...</span>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className=" bg-zinc-900 px-4 pb-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected 
                  ? "Ask me about your journals, tasks..." 
                  : "Connecting to chat..."
              }
              disabled={!isConnected || isTyping}
              rows={1}
              className="flex-1 resize-none border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent  disabled:cursor-not-allowed "
              style={{
                minHeight: '52px',
                maxHeight: '200px'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!isConnected || !input.trim() || isTyping}
              className="btn btn-primary px-6 py-7  text-lg rounded-lg disabled:btn-disabled transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          {/* Helper text */}
          <div className="text-xs text-gray-500 mt-2 text-center max-w-4xl mx-auto">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>

      </div>
    </div>
  );
}