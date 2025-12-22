import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Users, UserPlus, Activity, Pill, Stethoscope, ClipboardList, Plus } from 'lucide-react';
import Layout from '@/components/Layout';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [connectionCode, setConnectionCode] = useState(user?.connectionCode || null);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            const { data } = await api.get('/doctor/patients');
            setPatients(data);
        } catch (error) {
            console.error('Failed to fetch patients', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = async () => {
        try {
            const { data } = await api.post('/doctor/generate-code');
            setConnectionCode(data.connectionCode);
        } catch (error) {
            console.error('Failed to generate code', error);
        }
    };

    useEffect(() => {
        fetchPatients();
        // If the user object already has the code, set it. 
        // Note: The user object from context might be stale if the code was generated in a previous session but not refreshed. 
        //Ideally we'd fetch the user profile again or rely on the code generation response.
    }, []);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            Dr. {user?.name}'s Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage your patients and prescriptions</p>
                    </div>
                    
                    <Card className="w-full md:w-auto bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30 border-blue-100 dark:border-blue-900">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Connection Code</p>
                                <p className="text-2xl font-bold font-mono tracking-wider text-blue-600 dark:text-blue-400">
                                    {connectionCode || '----'}
                                </p>
                            </div>
                            {!connectionCode && (
                                <Button onClick={generateCode} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Generate
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Patient List */}
                <div className="grid gap-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-xl font-semibold">Your Patients</h2>
                    </div>
                    
                    {loading ? (
                         <div className="flex items-center justify-center p-12">
                            <div className="h-8 w-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : patients.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                                    <Users className="h-8 w-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium">No patients yet</h3>
                                <p className="text-muted-foreground max-w-sm mt-2">
                                    Share your connection code with your patients so they can link their account to you.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {patients.map(patient => (
                                <PatientCard key={patient._id} patient={patient} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

function PatientCard({ patient }) {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const { data } = await api.get(`/doctor/patient/${patient._id}/logs`);
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingLogs(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (isOpen) fetchLogs();
        }}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                            {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <CardTitle className="text-base">{patient.name}</CardTitle>
                            <CardDescription className="text-xs truncate">{patient.email}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mt-2">
                            <div className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                Patient
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        Patient File: {patient.name}
                    </DialogTitle>
                    <DialogDescription>View health logs and manage prescriptions.</DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                    {/* Prescribe Section */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Pill className="h-4 w-4 text-blue-600" />
                                Prescribe Medication
                            </h3>
                            <PrescribeDialog patientId={patient._id} patientName={patient.name} />
                        </div>
                    </div>

                    {/* Health Logs Section */}
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <ClipboardList className="h-4 w-4 text-teal-600" />
                            Recent Health Logs
                        </h3>
                        {loadingLogs ? (
                             <div className="text-center py-8 text-muted-foreground">Loading records...</div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                No health logs found.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map(log => (
                                    <div key={log._id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                        <div>
                                            <div className="font-medium text-sm">
                                                {new Date(log.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Mood: {log.mood}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm">
                                            {log.vitals?.bloodPressure && (
                                                <div className="font-mono text-blue-600">{log.vitals.bloodPressure} BP</div>
                                            )}
                                            {log.vitals?.heartRate && (
                                                <div className="font-mono text-rose-500">{log.vitals.heartRate} BPM</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function PrescribeDialog({ patientId, patientName }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: 'Daily',
        startDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/doctor/prescribe', {
                patientId,
                ...formData
            });
            setOpen(false);
            setFormData({ name: '', dosage: '', frequency: 'Daily', startDate: '' });
            alert(`Prescription sent to ${patientName}`);
        } catch (error) {
            console.error('Failed to prescribe', error);
            alert('Failed to send prescription');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Prescription
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Prescribe for {patientName}</DialogTitle>
                    <DialogDescription>
                        This will be added to the patient's medication schedule immediately.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="med-name">Medication Name</Label>
                        <Input
                            id="med-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="med-dosage">Dosage</Label>
                        <Input
                            id="med-dosage"
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="med-frequency">Frequency</Label>
                        <Input
                            id="med-frequency"
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="med-start">Start Date</Label>
                        <Input
                            id="med-start"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Confirm Prescription
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

