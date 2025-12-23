import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, Plus, Clock, Calendar, Edit2, Trash2 } from 'lucide-react';

export function MedicationList() {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMedications = async () => {
        try {
            const { data } = await api.get('/medications');
            setMedications(data);
        } catch (error) {
            console.error('Failed to fetch meds', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this medication?')) return;
        try {
            await api.delete(`/medications/${id}`);
            fetchMedications();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <AddMedicationDialog onMedicationAdded={fetchMedications} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {medications.map((med, index) => (
                    <Card
                        key={med._id}
                        className="group overflow-hidden border-l-4 border-l-blue-500 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 group-hover:scale-110 transition-transform">
                                        <Pill className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{med.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">{med.dosage}</p>
                                        {med.prescribedBy ? (
                                            <p className="text-xs text-blue-600 font-medium mt-1">
                                                Prescribed by Dr. {med.prescribedBy.name}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-slate-500 font-medium mt-1 italic">
                                                Self-managed
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Management Actions for Patients */}
                                {!med.prescribedBy && (
                                    <div className="flex items-center gap-1">
                                        <EditMedicationDialog medication={med} onMedicationUpdated={fetchMedications} />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => handleDelete(med._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{med.frequency}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Times: {med.timeOfIntake.join(', ')}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium">
                                        {med.status}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {medications.length === 0 && (
                    <div className="col-span-2 text-center p-12 rounded-xl border-2 border-dashed">
                        <Pill className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No medications added yet.</p>
                        <p className="text-sm text-muted-foreground mt-1">Click "Add Medication" to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function EditMedicationDialog({ medication, onMedicationUpdated }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        timeOfIntake: medication.timeOfIntake.join(', ')
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                timeOfIntake: formData.timeOfIntake.split(',').map(t => t.trim())
            };
            await api.put(`/medications/${medication._id}`, payload);
            setOpen(false);
            onMedicationUpdated();
        } catch (error) {
            console.error('Failed to update medication', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Medication</DialogTitle>
                    <DialogDescription>Update your medication details.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-dosage">Dosage</Label>
                        <Input
                            id="edit-dosage"
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-frequency">Frequency</Label>
                        <Input
                            id="edit-frequency"
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-time">Times (comma separated)</Label>
                        <Input
                            id="edit-time"
                            value={formData.timeOfIntake}
                            onChange={(e) => setFormData({ ...formData, timeOfIntake: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function AddMedicationDialog({ onMedicationAdded }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: 'Daily',
        startDate: '',
        timeOfIntake: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                timeOfIntake: formData.timeOfIntake.split(',').map(t => t.trim())
            };
            await api.post('/medications', payload);
            setOpen(false);
            setFormData({ name: '', dosage: '', frequency: 'Daily', startDate: '', timeOfIntake: '' });
            onMedicationAdded();
        } catch (error) {
            console.error('Failed to add medication', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-4 w-4" />
                    Add Medication
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                            <Pill className="h-5 w-5" />
                        </div>
                        Add Medication
                    </DialogTitle>
                    <DialogDescription>Add a new medication to your daily schedule.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Medication Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Aspirin"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input
                            id="dosage"
                            placeholder="e.g., 100mg"
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input
                            id="frequency"
                            placeholder="e.g., Daily, Twice Daily"
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="start">Start Date</Label>
                        <Input
                            id="start"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="time">Time of Intake</Label>
                        <Input
                            id="time"
                            placeholder="e.g., 08:00, 20:00"
                            value={formData.timeOfIntake}
                            onChange={(e) => setFormData({ ...formData, timeOfIntake: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                            Save Medication
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
