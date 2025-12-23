import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Plus, User, Clock, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ChatWindow from './ChatWindow';

// Helper function to check if chat should be active
const isChatActive = (appointmentDate) => {
    const now = new Date();
    const aptTime = new Date(appointmentDate);
    const oneHourBefore = new Date(aptTime.getTime() - (60 * 60 * 1000));
    const twentyFourHoursAfter = new Date(aptTime.getTime() + (24 * 60 * 60 * 1000));

    return now >= oneHourBefore && now <= twentyFourHoursAfter;
};

export function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-purple-100 text-purple-700 border-purple-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <AddAppointmentDialog onAdded={fetchAppointments} />
            </div>
            <div className="grid gap-4">
                {appointments.map((apt, index) => (
                    <Card
                        key={apt._id}
                        className="group border-l-4 border-l-purple-500 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 group-hover:scale-110 transition-transform">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">{apt.doctorName}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={`capitalize ${getStatusColor(apt.status)}`}>
                                    {apt.status || 'upcoming'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{apt.location}</span>
                            </div>
                            {apt.notes && (
                                <div className="mt-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900">
                                    <p className="text-sm italic text-purple-900 dark:text-purple-100">"{apt.notes}"</p>
                                </div>
                            )}

                            {/* Chat Integration */}
                            {apt.status === 'confirmed' && (
                                <div className="mt-4 pt-4 border-t">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                                                disabled={!isChatActive(apt.date)}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                Chat with Doctor
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px] p-0 border-0 bg-transparent shadow-none">
                                            <ChatWindow appointmentId={apt._id} otherPartyName={apt.doctorName} />
                                        </DialogContent>
                                    </Dialog>
                                    {!isChatActive(apt.date) && (
                                        <p className="text-[10px] text-center text-muted-foreground mt-1">
                                            Chat opens 1 hour before your appointment.
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {appointments.length === 0 && (
                    <div className="text-center p-12 rounded-xl border-2 border-dashed">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No upcoming appointments.</p>
                        <p className="text-sm text-muted-foreground mt-1">Schedule your first appointment</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function AddAppointmentDialog({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: '',
        location: '',
        notes: ''
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/patient/doctors');
                setDoctors(data);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            }
        };
        if (open) fetchDoctors();
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);
            
            // Find selected doctor name
            const selectedDoc = doctors.find(d => d._id === formData.doctorId);
            const doctorName = selectedDoc ? selectedDoc.name : 'Unknown';

            await api.post('/appointments', {
                ...formData,
                doctor: formData.doctorId, // Send ID for linking
                doctorName: `Dr. ${doctorName}`, // Send name for display fallback
                date: dateTime
            });
            setOpen(false);
            setFormData({ doctorId: '', date: '', time: '', location: '', notes: '' });
            onAdded();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-4 w-4" />
                    Schedule Appointment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                        New Appointment
                    </DialogTitle>
                    <DialogDescription>Request an appointment with your care team.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Select Doctor</Label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={formData.doctorId}
                            onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select a provider...</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>Dr. {doc.name} ({doc.specialization || 'General'})</option>
                            ))}
                        </select>
                        {doctors.length === 0 && (
                            <p className="text-xs text-red-500">You need to connect with a doctor first.</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Time</Label>
                            <Input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Location</Label>
                        <Input placeholder="Online / Clinic" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Notes (Reason)</Label>
                        <Input placeholder="Routine checkup..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={!formData.doctorId}>
                            Request Appointment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
