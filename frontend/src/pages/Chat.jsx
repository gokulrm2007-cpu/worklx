import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Send,
  MessageSquare,
  User,
  CheckCheck,
  ArrowLeft,
  Circle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Chat() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get('user') || 'user_worker_01';
  const otherUserName = searchParams.get('name') || 'Technician';

  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch past conversation from backend
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const res = await api.get(`/messages/${otherUserId}`);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    if (otherUserId) {
      loadConversation();
    }
  }, [otherUserId]);

  // 2. Socket.io listeners
  useEffect(() => {
    if (socket) {
      if (bookingId) {
        socket.emit('join_booking_room', bookingId);
      }

      socket.on('receive_message', (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        scrollToBottom();
      });

      socket.on('user_typing', ({ isTyping }) => {
        setOtherUserTyping(isTyping);
      });

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
      };
    }
  }, [socket, bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const text = inputMessage.trim();
    setInputMessage('');

    // Emit Socket.io real-time event
    if (socket && isConnected) {
      socket.emit('send_message', {
        receiverId: otherUserId,
        bookingId,
        message: text,
        senderId: user?._id,
        senderName: user?.name,
        senderImage: user?.profileImage,
      });
    }

    // Persist via REST API
    try {
      const res = await api.post('/messages', {
        receiverId: otherUserId,
        bookingId,
        message: text,
      });
      if (res.data.success && (!socket || !isConnected)) {
        setMessages((prev) => [...prev, res.data.message]);
      }
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (socket && bookingId) {
      socket.emit('typing', { bookingId, senderName: user?.name, isTyping: true });
      setTimeout(() => {
        socket.emit('typing', { bookingId, senderName: user?.name, isTyping: false });
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col h-[680px]">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                {otherUserName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                {otherUserName}
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium">
                {otherUserTyping ? 'Typing...' : isConnected ? 'Online (Real-Time)' : 'Active (Direct)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:9840112233"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
          {loading ? (
            <LoadingSpinner text="Connecting chat..." fullScreen={false} />
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">
              No messages yet. Send a greeting to start your conversation!
            </div>
          ) : (
            messages.map((m, idx) => {
              const sender = typeof m.senderId === 'object' ? m.senderId : {};
              const isMine = sender._id === user?._id || m.senderId === user?._id;

              return (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                      {otherUserName.charAt(0)}
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-500/10'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs shadow-sm'
                    }`}
                  >
                    <p>{m.message}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMine ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder={`Message ${otherUserName}...`}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
