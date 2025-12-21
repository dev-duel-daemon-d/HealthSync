import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Plus, User } from 'lucide-react';

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
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
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
    const [formData, setFormData] = useState({
        doctorName: '',
        date: '',
        time: '',
        location: '',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            await api.post('/appointments', {
                ...formData,
                date: dateTime
            });
            setOpen(false);
            setFormData({ doctorName: '', date: '', time: '', location: '', notes: '' });
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
                    <DialogDescription>Schedule a new appointment with your healthcare provider.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Doctor Name</Label>
                        <Input placeholder="Dr. Smith" value={formData.doctorName} onChange={e => setFormData({ ...formData, doctorName: e.target.value })} required />
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
                        <Input placeholder="City Hospital" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Notes (Optional)</Label>
                        <Input placeholder="Routine checkup..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Schedule Appointment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
