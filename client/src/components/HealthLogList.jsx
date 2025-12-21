import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Heart, Thermometer, TrendingUp } from 'lucide-react';

export function HealthLogList() {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        try {
            const { data } = await api.get('/logs');
            setLogs(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-4">
            <AddLogForm onAdded={fetchLogs} />
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {logs.map((log, index) => (
                    <Card
                        key={log._id}
                        className="group border-l-4 border-l-green-500 animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-950 text-green-600 group-hover:scale-110 transition-transform">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                            {log.vitals?.bloodPressure && (
                                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                                    <Heart className="h-4 w-4 text-red-500" />
                                    <span className="font-medium">BP:</span>
                                    <span>{log.vitals.bloodPressure}</span>
                                </div>
                            )}
                            {log.vitals?.heartRate && (
                                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">HR:</span>
                                    <span>{log.vitals.heartRate} bpm</span>
                                </div>
                            )}
                            {log.symptoms && (
                                <div className="mt-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900">
                                    <p className="text-sm italic text-yellow-900 dark:text-yellow-100">"{log.symptoms}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {logs.length === 0 && (
                    <div className="text-center p-8 rounded-xl border-2 border-dashed">
                        <Activity className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">No health logs yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function AddLogForm({ onAdded }) {
    const [formData, setFormData] = useState({
        symptoms: '',
        bloodPressure: '',
        heartRate: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/logs', {
                symptoms: formData.symptoms,
                vitals: {
                    bloodPressure: formData.bloodPressure,
                    heartRate: formData.heartRate
                }
            });
            setFormData({ symptoms: '', bloodPressure: '', heartRate: '' });
            onAdded();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="border-2 border-green-200 dark:border-green-900 shadow-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950 text-green-600">
                        <Activity className="h-4 w-4" />
                    </div>
                    Log Today's Vitals
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                Blood Pressure
                            </Label>
                            <Input
                                placeholder="120/80"
                                className="h-9 text-sm"
                                value={formData.bloodPressure}
                                onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Heart Rate
                            </Label>
                            <Input
                                placeholder="72"
                                type="number"
                                className="h-9 text-sm"
                                value={formData.heartRate}
                                onChange={e => setFormData({ ...formData, heartRate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Symptoms (Optional)</Label>
                        <Input
                            placeholder="How are you feeling?"
                            className="h-9 text-sm"
                            value={formData.symptoms}
                            onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
                    >
                        Save Log
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

// Add custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
`;
document.head.appendChild(style);
