import React, { useState, createContext, useContext, useEffect } from 'react';

// Chat Context for managing chat sessions
const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chatSessions, setChatSessions] = useState({
    agri: [],
    legal: []
  });
  const [currentSessionId, setCurrentSessionId] = useState({
    agri: null,
    legal: null
  });

  // Generate unique session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create new chat session
  const createNewSession = (botType) => {
    const sessionId = generateSessionId();
    const newSession = {
      id: sessionId,
      title: `Chat ${chatSessions[botType].length + 1}`,
      messages: [
        { 
          system: { 
            content: botType === 'agri' 
              ? "Hello! I'm your Kenyan Agriculture Advisor. Ask about crops, diseases, weather, or market prices."
              : "Hello! I'm your Kenyan Legal Advisor. I can help with legal questions specific to Kenyan law."
          },
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChatSessions(prev => ({
      ...prev,
      [botType]: [...prev[botType], newSession]
    }));

    setCurrentSessionId(prev => ({
      ...prev,
      [botType]: sessionId
    }));

    return sessionId;
  };

  // Get current session
  const getCurrentSession = (botType) => {
    const sessionId = currentSessionId[botType];
    if (!sessionId) return null;
    return chatSessions[botType].find(session => session.id === sessionId);
  };

  // Update session messages
  const updateSession = (botType, sessionId, newMessages) => {
    setChatSessions(prev => ({
      ...prev,
      [botType]: prev[botType].map(session =>
        session.id === sessionId
          ? {
              ...session,
              messages: newMessages,
              updatedAt: new Date(),
              title: generateSessionTitle(newMessages)
            }
          : session
      )
    }));
  };

  // Generate session title from first user message
  const generateSessionTitle = (messages) => {
    const firstUserMessage = messages.find(msg => 'user' in msg);
    if (firstUserMessage) {
      const content = firstUserMessage.user.content;
      return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }
    return 'New Chat';
  };

  // Switch to existing session
  const switchToSession = (botType, sessionId) => {
    setCurrentSessionId(prev => ({
      ...prev,
      [botType]: sessionId
    }));
  };

  // Delete session
  const deleteSession = (botType, sessionId) => {
    setChatSessions(prev => ({
      ...prev,
      [botType]: prev[botType].filter(session => session.id !== sessionId)
    }));

    // If deleting current session, switch to most recent or create new
    if (currentSessionId[botType] === sessionId) {
      const remainingSessions = chatSessions[botType].filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(prev => ({
          ...prev,
          [botType]: remainingSessions[remainingSessions.length - 1].id
        }));
      } else {
        setCurrentSessionId(prev => ({
          ...prev,
          [botType]: null
        }));
      }
    }
  };

  // Get all sessions for a bot type
  const getSessions = (botType) => {
    return chatSessions[botType].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };

  const value = {
    createNewSession,
    getCurrentSession,
    updateSession,
    switchToSession,
    deleteSession,
    getSessions,
    currentSessionId
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Chat History Sidebar Component
export const ChatHistory = ({ botType, isOpen, onClose }) => {
  const { getSessions, switchToSession, deleteSession, createNewSession, currentSessionId } = useChatContext();
  const sessions = getSessions(botType);

  const handleNewChat = () => {
    createNewSession(botType);
    onClose();
  };

  const handleSessionClick = (sessionId) => {
    switchToSession(botType, sessionId);
    onClose();
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      deleteSession(botType, sessionId);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const chatDate = new Date(date);
    const diffTime = Math.abs(now - chatDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return chatDate.toLocaleDateString();
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No chat sessions yet</p>
              <p className="text-sm">Start a new conversation!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-md ${
                  currentSessionId[botType] === session.id ? 'bg-blue-50 border-2 border-blue-200' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate mb-1">
                      {session.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>{formatDate(session.updatedAt)}</span>
                      <span>·</span>
                      <span>{session.messages.length} messages</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Overlay for mobile
export const ChatHistoryOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      onClick={onClose}
    />
  );
};