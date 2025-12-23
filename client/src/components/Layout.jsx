import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Pill, Calendar, Activity, BookOpen, LogOut, Heart, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Medications', path: '/medications', icon: Pill },
        { label: 'Appointments', path: '/appointments', icon: Calendar },
        { label: 'Wellness', path: '/wellness', icon: Activity },
        { label: 'Education', path: '/education', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 flex flex-col md:flex-row">
            {/* Sidebar / Navbar */}
            <aside className="w-full md:w-64 glass-card border-r border-white/20 flex-shrink-0 sticky top-0 md:h-screen z-50 flex flex-col">
                <div className="p-6 border-b border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            HealthSync
                        </h1>
                    </div>
                    {/* Notification Bell in Mobile/Sidebar Header */}
                    <div className="md:hidden">
                        <NotificationBell />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {/* Desktop Notification Bell entry (optional, but let's put it in the profile area instead) */}
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-700 dark:text-blue-300 font-medium md:translate-x-1"
                                        : "hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
                                )}
                                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "group-hover:text-blue-600")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
                        <NotificationBell />
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-100 dark:border-blue-900/30 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-semibold truncate max-w-[120px]">{user?.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
