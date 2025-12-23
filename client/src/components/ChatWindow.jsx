import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Connect to socket server
const socket = io(import.meta.env.VITE_API_URL.replace('/api', '') || 'http://localhost:5000', {
    withCredentials: true
});

export default function ChatWindow({ appointmentId, otherPartyName }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        // 1. Fetch History
        const fetchHistory = async () => {
            try {
                const { data } = await api.get(`/chat/${appointmentId}`);
                setMessages(data);
            } catch (error) {
                console.error('Failed to fetch chat history', error);
            }
        };
        fetchHistory();

        // 2. Join Room
        socket.emit('join_room', appointmentId);

        // 3. Listen for Messages
        socket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [appointmentId]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            appointmentId,
            senderId: user._id,
            text: newMessage
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[500px] bg-card rounded-xl border shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-muted/50 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">{otherPartyName}</h3>
                    <p className="text-[10px] text-green-500 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const isMe = msg.sender === user._id;
                        return (
                            <div key={index} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm",
                                    isMe 
                                        ? "bg-blue-600 text-white rounded-tr-none" 
                                        : "bg-muted dark:bg-slate-800 text-foreground rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/30 flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 shrink-0">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
