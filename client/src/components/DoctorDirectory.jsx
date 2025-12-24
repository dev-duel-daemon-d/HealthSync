import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Search, UserPlus, CheckCircle, Clock, Stethoscope, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DoctorDirectory() {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [myRequests, setMyRequests] = useState([]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const endpoint = searchTerm ? `/patient/doctors?search=${searchTerm}` : '/patient/doctors';
            const { data } = await api.get(endpoint);
            setDoctors(data);
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRequests = async () => {
        try {
            const { data } = await api.get('/patient/requests');
            setMyRequests(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDoctors();
        fetchMyRequests();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchDoctors();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Check status helper
    const getDoctorState = (doctor) => {
        // 1. Check if already connected (in user.doctors array)
        // user.doctors might be array of IDs or Objects depending on population. 
        // Safest is to check ID existence.
        const isConnected = user?.doctors?.some(d => (d._id || d) === doctor._id);
        if (isConnected) return { status: 'connected' };

        // 2. Check if pending request exists
        const request = myRequests.find(r => r.doctor._id === doctor._id || r.doctor === doctor._id);
        if (request) return { status: request.status, request }; // 'pending', 'accepted', 'rejected'

        return { status: 'none' };
    };

    const handleSuccess = () => {
        fetchMyRequests();
        // Ideally we should also refresh 'user' to get updated doctors list if a request was auto-accepted,
        // but since acceptance happens on doctor side, refreshing requests is enough for patient view.
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Find a Specialist</h2>
                    <p className="text-muted-foreground">Search for doctors and request to connect.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name or specialization..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="h-24 bg-muted/50 rounded-t-lg" />
                            <CardContent className="h-32 p-4" />
                        </Card>
                    ))}
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">No doctors found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doctor => {
                        const { status, request } = getDoctorState(doctor);
                        return (
                            <DoctorCard 
                                key={doctor._id} 
                                doctor={doctor} 
                                status={status}
                                request={request} 
                                onRequestUpdate={handleSuccess}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function DoctorCard({ doctor, status, request, onRequestUpdate }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            await api.post('/patient/request-connection', {
                doctorId: doctor._id,
                message
            });
            onRequestUpdate();
            setOpen(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this request?')) return;
        setLoading(true);
        try {
            await api.delete(`/patient/requests/${request._id}`);
            onRequestUpdate();
        } catch (error) {
            console.error(error);
            alert('Failed to cancel request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500 overflow-hidden group">
            <CardHeader className="pb-4 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <Stethoscope className="h-24 w-24 text-blue-100 dark:text-blue-900 -rotate-12 transform translate-x-8 -translate-y-8" />
                </div>
                <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xl shadow-inner">
                        {doctor.name.charAt(0)}
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Dr. {doctor.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                            {doctor.specialization || 'General Practitioner'}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location || 'Online / Remote'}</span>
                </div>
                {doctor.licenseNumber && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        License: {doctor.licenseNumber}
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-0">
                {status === 'pending' ? (
                    <Button 
                        variant="outline" 
                        className="w-full text-yellow-700 border-yellow-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 group/btn"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        <Clock className="mr-2 h-4 w-4 group-hover/btn:hidden" /> 
                        <span className="group-hover/btn:hidden">Request Pending</span>
                        <span className="hidden group-hover/btn:inline-flex items-center">
                            Cancel Request
                        </span>
                    </Button>
                ) : status === 'connected' || status === 'accepted' ? (
                    <Button disabled className="w-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-50">
                        <CheckCircle className="mr-2 h-4 w-4" /> Connected
                    </Button>
                ) : (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all">
                                <UserPlus className="mr-2 h-4 w-4" /> Connect
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Connect with Dr. {doctor.name}</DialogTitle>
                                <DialogDescription>
                                    Send a connection request to share your health data with this specialist.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Reason for Contact (Optional)</Label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Briefly explain why you are seeking consultation..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={handleConnect} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Request'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </CardFooter>
        </Card>
    );
}
