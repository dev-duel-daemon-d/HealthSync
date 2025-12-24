import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { cn } from '@/lib/utils';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-white/20 dark:hover:bg-slate-800/50">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center">
                                {unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                        <DialogTitle className="flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    {unreadCount} New
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>Your latest health updates</DialogDescription>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700">
                            Mark all read
                        </Button>
                    )}
                </DialogHeader>

                <ScrollArea className="h-[350px] pr-4 mt-4">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-center opacity-50">
                            <Bell className="h-12 w-12 mb-2" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all relative group",
                                        n.isRead 
                                            ? "bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800" 
                                            : "bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50 shadow-sm"
                                    )}
                                >
                                    {!n.isRead && (
                                        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500" />
                                    )}
                                    <p className={cn("text-sm leading-relaxed pr-4", !n.isRead && "font-medium")}>
                                        {n.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {!n.isRead && (
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => markAsRead(n._id)}
                                                className="h-6 px-2 text-[10px] hover:bg-blue-100 dark:hover:bg-blue-950"
                                            >
                                                <Check className="h-3 w-3 mr-1" />
                                                Mark Read
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
