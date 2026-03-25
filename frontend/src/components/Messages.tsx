import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { MessageSquare, Send, Paperclip, ArrowLeft, Search, MoreVertical, CheckCheck, Clock } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { PostLoginNav } from './PostLoginNav';

interface Message {
  id: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  attachments?: Array<{ name: string; type: string; url: string }>;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  relatedRequirement?: string;
}

import { api } from '../services/api';

export function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const userStr = localStorage.getItem('expertly_yours_user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id || '';

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api.get('/conversations');
        setConversations(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      try {
        const data = await api.get(`/messages/${conversationId}`);
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Live sync polling
    return () => clearInterval(interval);
  }, [conversationId]);

  const selectedConversation = Array.isArray(conversations) ? conversations.find(c => c.id === conversationId) : undefined;

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;
    
    try {
      await api.post('/messages/send', { conversationId, content: messageText });
      setMessageText('');
      const data = await api.get(`/messages/${conversationId}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.relatedRequirement?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA]">
      {/* Top Navigation */}
      <PostLoginNav />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full pt-16">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 text-left transition-colors ${
                  conversationId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={conv.participantAvatar || 'https://via.placeholder.com/100'}
                    alt={conv.participantName || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.participantName}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 truncate">{conv.participantTitle}</p>
                    {conv.relatedRequirement && (
                      <p className="text-xs text-blue-600 mb-1 truncate">Re: {conv.relatedRequirement}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-medium flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {conversationId && selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-300 flex items-center justify-between">
              <Link
                to={`/profile/${selectedConversation.participantId}`}
                className="flex items-center gap-3 hover:bg-gray-50 -m-2 p-2 rounded transition-colors"
              >
                <img
                  src={selectedConversation.participantAvatar || 'https://via.placeholder.com/100'}
                  alt={selectedConversation.participantName || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                />
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedConversation.participantName}</h2>
                  <p className="text-sm text-gray-600">{selectedConversation.participantTitle}</p>
                </div>
              </Link>
              <button className="p-2 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Context Banner */}
            {selectedConversation.relatedRequirement && (
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-200 text-sm">
                <span className="text-blue-900">
                  💬 Conversation about: <strong>{selectedConversation.relatedRequirement}</strong>
                </span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-lg ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text || (message as any).content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, idx) => (
                              <a
                                key={idx}
                                href={attachment.url}
                                className={`flex items-center gap-2 text-xs ${
                                  isCurrentUser ? 'text-blue-100 hover:text-white' : 'text-blue-600 hover:underline'
                                }`}
                              >
                                <Paperclip className="w-3 h-3" />
                                {attachment.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        {isCurrentUser && (
                          message.isRead ? <CheckCheck className="w-3 h-3 text-blue-600" /> : <CheckCheck className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-300">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center bg-white text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}