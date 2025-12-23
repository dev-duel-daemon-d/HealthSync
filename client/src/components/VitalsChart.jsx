import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VitalsChart({ logs }) {
    // 1. Process data for charts
    // We need to reverse the logs so they flow left-to-right (oldest to newest)
    const chartData = [...logs].reverse().map(log => ({
        date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        fullDate: new Date(log.date).toLocaleString(),
        systolic: log.vitals?.bloodPressure ? parseInt(log.vitals.bloodPressure.split('/')[0]) : null,
        diastolic: log.vitals?.bloodPressure ? parseInt(log.vitals.bloodPressure.split('/')[1]) : null,
        heartRate: log.vitals?.heartRate ? parseInt(log.vitals.heartRate) : null,
        weight: log.vitals?.weight ? parseFloat(log.vitals.weight) : null,
        glucose: log.vitals?.glucose ? parseFloat(log.vitals.glucose) : null,
    })).filter(item => item.systolic || item.heartRate || item.weight || item.glucose); // Remove empty entries

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-xl text-muted-foreground">
                Not enough data to display charts
            </div>
        );
    }

    return (
        <Tabs defaultValue="bp" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
                <TabsTrigger value="heart">Heart Rate</TabsTrigger>
                <TabsTrigger value="other">Weight & Glucose</TabsTrigger>
            </TabsList>

            <TabsContent value="bp" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Blood Pressure History</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis domain={[60, 180]} />
                                <Tooltip labelStr="fullDate" />
                                <Legend />
                                <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic (mmHg)" strokeWidth={2} dot={{r: 4}} />
                                <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic (mmHg)" strokeWidth={2} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="heart">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Heart Rate Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                                <Tooltip labelStr="fullDate" />
                                <Area type="monotone" dataKey="heartRate" stroke="#ec4899" fillOpacity={1} fill="url(#colorHr)" name="Heart Rate (BPM)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Weight (kg)</CardTitle></CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="date" hide />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-sm">Glucose (mg/dL)</CardTitle></CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="date" hide />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="glucose" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                 </div>
            </TabsContent>
        </Tabs>
    );
}
