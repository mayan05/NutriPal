import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, UserProfile } from '../types/index';
import { granite } from '../services/granite';

interface ChatInterfaceProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  onViewMealPlan: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userProfile, onEditProfile, onViewMealPlan }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${userProfile.name}! 👋 I'm your AI Nutrition Assistant. I'm here to help you with personalized meal plans, nutrition advice, and healthy eating tips based on your profile. What would you like to know about nutrition today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await granite.sendMessage(inputMessage, userProfile);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Create a meal plan for today",
    "Suggest healthy breakfast ideas",
    "What snacks are good for my goals?",
    "Help me with portion sizes",
    "Give me a grocery shopping list"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <h2>🥗 NutriPal Chat</h2>
          <div className="user-info">
            <span>Welcome, {userProfile.name}!</span>
            <button onClick={onEditProfile} className="edit-profile-btn">
              Edit Profile
            </button>
            <button onClick={onViewMealPlan} className="edit-profile-btn">
              View Meal Plan
            </button>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-content">
              <div className="message-text">
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      // Custom styling for markdown components
                      h1: ({children}) => <h1 style={{fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.5em'}}>{children}</h1>,
                      h2: ({children}) => <h2 style={{fontSize: '1.3em', fontWeight: 'bold', marginBottom: '0.4em'}}>{children}</h2>,
                      h3: ({children}) => <h3 style={{fontSize: '1.1em', fontWeight: 'bold', marginBottom: '0.3em'}}>{children}</h3>,
                      strong: ({children}) => <strong style={{fontWeight: 'bold', color: '#2563eb'}}>{children}</strong>,
                      p: ({children}) => <p style={{marginBottom: '0.8em', lineHeight: '1.5'}}>{children}</p>,
                      ul: ({children}) => <ul style={{marginLeft: '1.2em', marginBottom: '0.8em'}}>{children}</ul>,
                      ol: ({children}) => <ol style={{marginLeft: '1.2em', marginBottom: '0.8em'}}>{children}</ol>,
                      li: ({children}) => <li style={{marginBottom: '0.4em', lineHeight: '1.4'}}>{children}</li>,
                      code: ({children}) => <code style={{backgroundColor: '#f3f4f6', padding: '0.2em 0.4em', borderRadius: '3px', fontSize: '0.9em'}}>{children}</code>,
                      blockquote: ({children}) => <blockquote style={{borderLeft: '4px solid #e5e7eb', paddingLeft: '1em', margin: '0.8em 0', fontStyle: 'italic'}}>{children}</blockquote>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-questions">
        <p>Quick questions you can ask:</p>
        <div className="quick-buttons">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="quick-btn"
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about nutrition..."
            disabled={isLoading}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;