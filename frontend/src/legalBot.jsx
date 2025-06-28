import React, { useState, useRef, useEffect } from 'react';
import { useChatContext, ChatHistory, ChatHistoryOverlay } from './ChatManager';
import { backend as legalbot } from 'declarations/backend';

const Legalbot = () => {
  const { 
    getCurrentSession, 
    updateSession, 
    createNewSession, 
    currentSessionId 
  } = useChatContext();
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const chatBoxRef = useRef(null);

  const botType = 'legal';
  const currentSession = getCurrentSession(botType);

  // Initialize session if none exists
  useEffect(() => {
    if (!currentSession) {
      createNewSession(botType);
    }
  }, [currentSession, createNewSession]);

  const formatTime = (date) => {
    const h = '0' + date.getHours();
    const m = '0' + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

  const sendMessage = async (messages) => {
    try {
      // Extract messages for backend (exclude system welcome message)
      const messagesToSend = messages.slice(1).filter(msg => 'user' in msg || ('system' in msg && msg.system.content !== "Analyzing your legal question..."));
      const response = await legalbot.chat(messagesToSend);
      
      const updatedMessages = [...messages];
      updatedMessages.pop(); // Remove loading message
      updatedMessages.push({ 
        system: { 
          content: response,
          timestamp: new Date()
        }
      });

      updateSession(botType, currentSession.id, updatedMessages);
    } catch (err) {
      console.error(err);
      const updatedMessages = [...messages];                                                
      updatedMessages.pop(); // Remove loading message
      updatedMessages.push({ 
        system: { 
          content: "Sorry, I encountered an error processing your legal question. Please try again.",
          timestamp: new Date()
        }
      });
      updateSession(botType, currentSession.id, updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentSession) return;

    const userMessage = { 
      user: { 
        content: inputValue,
        timestamp: new Date()
      }
    };
    const loadingMessage = { 
      system: { 
        content: 'Analyzing your legal question...',
        timestamp: new Date()
      }
    };

    const newMessages = [...currentSession.messages, userMessage, loadingMessage];
    updateSession(botType, currentSession.id, newMessages);
    
    setInputValue('');
    setIsLoading(true);
    
    // Send message to backend
    sendMessage(newMessages);
  };

  const handleNewChat = () => {
    createNewSession(botType);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [currentSession?.messages]);

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Chat History */}
      <ChatHistory 
        botType={botType}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
      <ChatHistoryOverlay 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 hover:bg-blue-200 rounded-lg transition-colors text-blue-700"
            title="Chat History"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-semibold text-blue-800">⚖️ Kenyan Legal Advisor</h2>
            <p className="text-sm text-blue-600">Ask about land rights, women's rights, ID/Passport issues, or legal disputes</p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          title="Start New Chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-white"
      >
        {currentSession.messages.map((m, i) => {
          const isUser = 'user' in m;
          const message = isUser ? m.user : m.system;
          const text = message.content;
          const timestamp = message.timestamp;

          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                isUser 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-l-2xl rounded-br-sm' 
                  : 'bg-white text-gray-800 rounded-r-2xl rounded-bl-sm shadow-md border border-gray-100'
              } px-4 py-3 break-words`}>
                <div className="whitespace-pre-wrap">{text}</div>
                {timestamp && (
                  <div className={`text-xs mt-2 ${
                    isUser ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {formatTime(timestamp)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Ask your legal question..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Legalbot;