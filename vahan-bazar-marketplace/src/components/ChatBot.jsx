import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Minimize2
} from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Check chatbot health and initialize
      checkChatbotHealth();
      // Initial greeting message
      setTimeout(() => {
        addBotMessage("Hello! 👋 I'm VB Assistant, powered by advanced AI. I'm here to help you find the perfect two-wheeler. How can I assist you today?");
      }, 500);
    }
  }, [isOpen]);
  
  const checkChatbotHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/health`);
      const data = await response.json();
      setIsOnline(data.success);
    } catch (error) {
      console.error('Chatbot health check failed:', error);
      setIsOnline(false);
    }
  };

  const addBotMessage = (message, options = null) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'bot',
      timestamp: new Date(),
      options: options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender === 'bot' ? 'bot' : 'user',
        timestamp: msg.timestamp.toISOString()
      }));

      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
          conversationId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setConversationId(data.data.conversationId);
        addBotMessage(data.data.message);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat API error:', error);
      // Fallback to local response generation
      const response = generateBotResponse(userMessage);
      addBotMessage(response.message, response.options);
    }
    
    setIsTyping(false);
  };

  const handleQuickAction = async (action) => {
    addUserMessage(action);
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender === 'bot' ? 'bot' : 'user',
        timestamp: msg.timestamp.toISOString()
      }));

      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: action,
          conversationHistory,
          conversationId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setConversationId(data.data.conversationId);
        addBotMessage(data.data.message);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Quick action API error:', error);
      const response = generateBotResponse(action);
      addBotMessage(response.message, response.options);
    }
    
    setIsTyping(false);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Vehicle recommendations
    if (message.includes('bike') || message.includes('motorcycle')) {
      return {
        message: "Great choice! 🏍️ I can help you find the perfect bike. Here are some popular options:",
        options: [
          { text: "Budget Bikes (Under ₹1L)", action: "budget_bikes" },
          { text: "Sports Bikes", action: "sports_bikes" },
          { text: "Commuter Bikes", action: "commuter_bikes" },
          { text: "Premium Bikes", action: "premium_bikes" }
        ]
      };
    }

    if (message.includes('scooter')) {
      return {
        message: "Perfect for city commuting! 🛵 Here are our top scooter categories:",
        options: [
          { text: "Budget Scooters", action: "budget_scooters" },
          { text: "Premium Scooters", action: "premium_scooters" },
          { text: "Electric Scooters", action: "electric_scooters" }
        ]
      };
    }

    if (message.includes('electric') || message.includes('ev')) {
      return {
        message: "Eco-friendly choice! ⚡ Electric vehicles are the future:",
        options: [
          { text: "Electric Scooters", action: "electric_scooters" },
          { text: "Electric Bikes", action: "electric_bikes" },
          { text: "Charging Infrastructure", action: "charging_info" },
          { text: "Government Subsidies", action: "subsidies" }
        ]
      };
    }

    // Pricing queries
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
      return {
        message: "I can help you find vehicles within your budget! 💰 What's your price range?",
        options: [
          { text: "Under ₹50,000", action: "budget_under_50k" },
          { text: "₹50,000 - ₹1,00,000", action: "budget_50k_1l" },
          { text: "₹1,00,000 - ₹2,00,000", action: "budget_1l_2l" },
          { text: "Above ₹2,00,000", action: "budget_above_2l" }
        ]
      };
    }

    // Financing queries
    if (message.includes('loan') || message.includes('emi') || message.includes('finance')) {
      return {
        message: "We offer easy financing options! 💳 Here's what you need to know:",
        options: [
          { text: "EMI Calculator", action: "emi_calculator" },
          { text: "Loan Requirements", action: "loan_requirements" },
          { text: "Interest Rates", action: "interest_rates" },
          { text: "Partner Banks", action: "partner_banks" }
        ]
      };
    }

    // Test ride queries
    if (message.includes('test') || message.includes('ride')) {
      return {
        message: "Test rides are free and easy to book! 🏍️ Here's how:",
        options: [
          { text: "Book Test Ride", action: "book_test_ride" },
          { text: "Test Ride Requirements", action: "test_ride_requirements" },
          { text: "Available Locations", action: "test_ride_locations" }
        ]
      };
    }

    // Support queries
    if (message.includes('help') || message.includes('support') || message.includes('problem')) {
      return {
        message: "I'm here to help! 🤝 What do you need assistance with?",
        options: [
          { text: "Account Issues", action: "account_help" },
          { text: "Booking Problems", action: "booking_help" },
          { text: "Payment Issues", action: "payment_help" },
          { text: "Talk to Human Agent", action: "human_agent" }
        ]
      };
    }

    // Contact information
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return {
        message: "Here are our contact details: 📞",
        options: [
          { text: "📞 Call: 1800-123-4567", action: "call_support" },
          { text: "📧 Email: support@vahanbazar.com", action: "email_support" },
          { text: "💬 Live Chat", action: "live_chat" },
          { text: "📍 Visit Showroom", action: "showroom_locations" }
        ]
      };
    }

    // Specific vehicle recommendations based on categories
    if (message.includes('budget_bikes')) {
      return {
        message: "Here are some excellent budget-friendly bikes under ₹1L:",
        options: [
          { text: "Honda CB Shine - ₹75,000", action: "honda_cb_shine" },
          { text: "Bajaj CT 100 - ₹65,000", action: "bajaj_ct_100" },
          { text: "TVS Star City - ₹70,000", action: "tvs_star_city" },
          { text: "View All Budget Bikes", action: "view_budget_bikes" }
        ]
      };
    }

    // Default responses
    const defaultResponses = [
      {
        message: "That's an interesting question! 🤔 Let me help you with that. Here are some popular topics:",
        options: [
          { text: "Find Vehicles", action: "find_vehicles" },
          { text: "Financing Options", action: "financing" },
          { text: "Book Test Ride", action: "test_ride" },
          { text: "Get Support", action: "support" }
        ]
      },
      {
        message: "I'd love to help you find the perfect vehicle! Here's what I can assist with:",
        options: [
          { text: "🏍️ Bikes & Motorcycles", action: "bikes" },
          { text: "🛵 Scooters", action: "scooters" },
          { text: "⚡ Electric Vehicles", action: "electric" },
          { text: "💰 Financing", action: "financing" }
        ]
      }
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const quickActions = [
    { text: "Find Bikes", action: "bikes" },
    { text: "Scooters", action: "scooters" },
    { text: "Electric Vehicles", action: "electric" },
    { text: "EMI Calculator", action: "emi_calculator" },
    { text: "Book Test Ride", action: "test_ride" },
    { text: "Get Support", action: "support" }
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 touch-manipulation"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-bounce">
            <Bot className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed inset-4 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-80 lg:w-96 w-auto bg-white rounded-lg shadow-2xl z-50 transition-all duration-300 flex flex-col ${
          isMinimized ? 'h-16 sm:w-80 lg:w-96' : 'h-auto sm:h-[500px] lg:h-[600px] max-h-[calc(100vh-2rem)]'
        } sm:max-w-none max-w-none`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base truncate">VB Assistant</h3>
                <p className="text-xs opacity-90 truncate">
                  {isOnline ? '🤖 AI Powered • Online' : '⚠️ Offline Mode'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
              <button
                onClick={toggleMinimize}
                className="p-1.5 sm:p-2 rounded hover:bg-white/20 transition-colors flex items-center justify-center"
                title="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 sm:p-2 rounded hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center group"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:text-red-100 transition-colors" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 min-h-0">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-6 sm:py-8">
                    <Bot className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-blue-500" />
                    <p className="text-sm">Start a conversation with VB Assistant</p>
                    <p className="text-xs mt-1">{isOnline ? 'Powered by Gemini AI' : 'Smart fallback mode'}</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border shadow-sm'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                            {message.text.split('\n').map((line, index) => (
                              <div key={index} className={index > 0 ? 'mt-2' : ''}>
                                {line.includes('**') ? (
                                  line.split(/\*\*(.*?)\*\*/).map((part, i) => 
                                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                  )
                                ) : (
                                  line
                                )}
                              </div>
                            ))}
                          </div>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      {message.options && (
                        <div className="grid grid-cols-1 gap-2 mt-3">
                          {message.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickAction(option.action)}
                              className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border text-sm text-gray-700 transition-colors flex items-center justify-between group"
                            >
                              <span>{option.text}</span>
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border shadow-sm rounded-lg px-4 py-2 flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 0 && (
                <div className="px-3 sm:px-4 py-2 border-t bg-white flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.action)}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs text-gray-700 transition-colors text-left"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 sm:p-4 border-t bg-white rounded-b-lg flex-shrink-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-2 focus:outline-none focus:border-blue-500 text-sm min-w-0"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;