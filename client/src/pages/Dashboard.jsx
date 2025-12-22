import { useState } from 'react';
import Layout from '@/components/Layout';
import { MedicationList } from '@/components/MedicationList';
import { AppointmentList } from '@/components/AppointmentList';
import { HealthLogList } from '@/components/HealthLogList';
import { Pill, Calendar, Activity, Stethoscope, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/services/api';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <Layout>
            {/* Welcome Section */}
            <div className="animate-slide-up">
                <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
                        <p className="text-blue-100 text-lg">Your health journey continues today.</p>
                        <div className="flex gap-4 mt-6">
                            <div className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
                                📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <OverviewCard icon={Pill} label="Medications" value="3 Active" color="blue" />
                <OverviewCard icon={Calendar} label="Appointments" value="2 Upcoming" color="purple" />
                <OverviewCard icon={Activity} label="Health Score" value="98%" color="green" />
                <ConnectDoctorCard />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600">
                                <Pill className="h-5 w-5" />
                            </div>
                            Today's Schedule
                        </h2>
                        <MedicationList />
                    </section>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600">
                                <Activity className="h-5 w-5" />
                            </div>
                            Quick Vitals
                        </h2>
                        <HealthLogList />
                    </section>
                </div>
            </div>
        </Layout>
    );
}

function OverviewCard({ icon: Icon, label, value, color }) {
    const colorStyles = {
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        green: "bg-green-500",
    };

    return (
        <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-3 rounded-lg ${colorStyles[color]} text-white shadow-lg`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function ConnectDoctorCard() {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        if (!code) return;
        setLoading(true);
        try {
            await api.post('/doctor/connect', { connectionCode: code });
            alert('Connected successfully!');
            setOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to connect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="glass-card p-6 rounded-xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer border-dashed border-2 border-blue-200">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 shadow-sm">
                        <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Care Team</p>
                        <p className="text-base font-bold text-blue-600">Connect Doctor</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Connect with your Doctor</DialogTitle>
                    <DialogDescription>
                        Enter the 6-character code provided by your doctor (e.g., DOC-A1B2).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="code"
                                placeholder="DOC-XXXX"
                                className="pl-10 uppercase tracking-widest font-mono"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                maxLength={10}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleConnect} disabled={loading || !code} className="w-full">
                        {loading ? 'Connecting...' : 'Connect to Doctor'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
