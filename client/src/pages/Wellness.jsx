import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Moon, Droplets, Smile, Frown, Meh, Sun, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import api from '@/services/api';

export default function Wellness() {
    return (
        <Layout>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Wellness Tracker</h1>
                <p className="text-muted-foreground">Monitor your mental health, sleep, and hydration.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <MoodTracker />
                <SleepTracker />
                <WaterTracker />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Wellness History</h2>
                <div className="glass-card p-6 rounded-xl flex items-center justify-center min-h-[200px] border-2 border-dashed border-gray-200">
                    <div className="text-center text-muted-foreground">
                        <ActivityChart />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState(null);
    const moods = [
        { label: 'Happy', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { label: 'Neutral', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100' },
        { label: 'Sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Stressed', icon: CloudRain, color: 'text-purple-500', bg: 'bg-purple-100' },
        { label: 'Calm', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-100' },
    ];

    const logMood = async () => {
        if (!selectedMood) return;
        try {
            await api.post('/logs', { mood: selectedMood });
            alert('Mood logged!');
            setSelectedMood(null);
        } catch (e) { console.error(e) }
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-600">
                        <Brain className="h-5 w-5" />
                    </div>
                    <CardTitle>Morning Check-in</CardTitle>
                </div>
                <CardDescription>How are you feeling right now?</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between gap-2 mb-6">
                    {moods.map((m) => {
                        const Icon = m.icon;
                        const isSelected = selectedMood === m.label;
                        return (
                            <button
                                key={m.label}
                                onClick={() => setSelectedMood(m.label)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isSelected ? 'scale-110 ring-2 ring-yellow-400 bg-white shadow-md' : 'hover:bg-gray-50 opacity-70 hover:opacity-100'}`}
                            >
                                <Icon className={`h-8 w-8 ${m.color}`} />
                                <span className="text-xs font-medium">{m.label}</span>
                            </button>
                        );
                    })}
                </div>
                <Button onClick={logMood} disabled={!selectedMood} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">
                    Log Mood
                </Button>
            </CardContent>
        </Card>
    );
}

function SleepTracker() {
    const [hours, setHours] = useState(7);

    const logSleep = async () => {
        try {
            await api.post('/logs', { sleepHours: hours });
            alert('Sleep logged!');
        } catch (e) { console.error(e) }
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600">
                        <Moon className="h-5 w-5" />
                    </div>
                    <CardTitle>Sleep Analysis</CardTitle>
                </div>
                <CardDescription>Track your sleep quality</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center py-4">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">{hours} hr</div>
                    <input
                        type="range"
                        min="0"
                        max="12"
                        step="0.5"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-sm text-muted-foreground mt-4">Recommended: 7-9 hours</p>
                </div>
                <Button onClick={logSleep} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">Save Sleep Data</Button>
            </CardContent>
        </Card>
    );
}

function WaterTracker() {
    const [glasses, setGlasses] = useState(0);

    const logWater = async () => {
        try {
            await api.post('/logs', { waterIntake: glasses * 0.25 }); // approx liters
            alert('Hydration logged!');
        } catch (e) { console.error(e) }
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900 text-cyan-600">
                        <Droplets className="h-5 w-5" />
                    </div>
                    <CardTitle>Hydration</CardTitle>
                </div>
                <CardDescription>Daily water intake goal (8 glasses)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-4 py-2 mb-4">
                    <Button variant="outline" size="icon" onClick={() => setGlasses(Math.max(0, glasses - 1))}>-</Button>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-600">{glasses}</div>
                        <div className="text-xs text-muted-foreground">Glasses</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setGlasses(glasses + 1)}>+</Button>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(glasses / 8) * 100}%` }}></div>
                </div>
                <Button onClick={logWater} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white">Update Log</Button>
            </CardContent>
        </Card>
    );
}

function ActivityChart() {
    return (
        <div className="flex items-end gap-2 h-32 w-full max-w-xs mx-auto opacity-50">
            {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                <div key={i} className="w-8 bg-indigo-200 rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
        </div>
    )
}
