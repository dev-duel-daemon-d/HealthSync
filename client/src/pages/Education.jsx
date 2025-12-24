import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Heart, Shield, Stethoscope, Video, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/services/api';

export default function Education() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requesting, setRequesting] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const resources = [
        {
            category: 'Conditions',
            title: 'Understanding Hypertension',
            description: 'A comprehensive guide to managing high blood pressure through diet and exercise.',
            icon: Heart,
            color: 'text-red-500',
            bg: 'bg-red-100',
            readTime: '5 min read'
        },
        {
            category: 'Medication',
            title: 'Medication Adherence Tips',
            description: 'Why taking your medication on time matters and how to build a routine.',
            icon: Shield,
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            readTime: '3 min read'
        },
        {
            category: 'Lifestyle',
            title: 'Sleep Hygiene Basics',
            description: 'Simple habits that can dramatically improve your sleep quality.',
            icon: MoonIcon,
            color: 'text-indigo-500',
            bg: 'bg-indigo-100',
            readTime: '7 min read'
        },
        {
            category: 'Telehealth',
            title: 'Preparing for Teleconsultations',
            description: 'How to get the most out of your virtual doctor appointments.',
            icon: Video,
            color: 'text-purple-500',
            bg: 'bg-purple-100',
            readTime: '4 min read'
        }
    ];

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/doctor/all');
            setDoctors(data);
        } catch (error) {
            console.error('Failed to load doctors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (doctorId) => {
        setRequesting(doctorId);
        try {
            await api.post('/patient/request-connection', { doctorId });
            alert('Connection request sent!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send request');
        } finally {
            setRequesting(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
        }
    }, [isOpen]);

    return (
        <Layout>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Health Education</h1>
                <p className="text-muted-foreground">Certified resources to help you manage your health better.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {resources.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-none shadow-md">
                            <div className={`h-2 w-full ${item.bg.replace('bg-', 'bg-gradient-to-r from-')}-400 to-${item.bg.replace('bg-', '')}-600`}></div>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={`${item.bg} ${item.color} border-none`}>
                                        {item.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" /> {item.readTime}
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${item.bg} ${item.color} h-fit group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">{item.title}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="pt-0">
                                <Button variant="ghost" className="w-full justify-between hover:bg-slate-50 dark:hover:bg-slate-900 group/btn">
                                    Read Article
                                    <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Need Professional Help?</h2>
                        <p className="text-blue-100">Connect with healthcare providers for personalized advice.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                                <Stethoscope className="mr-2 h-5 w-5" />
                                Find a Doctor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Available Doctors</DialogTitle>
                                <DialogDescription>
                                    Browse our network of healthcare professionals and send a connection request.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[400px] mt-4 pr-4">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                    </div>
                                ) : doctors.length > 0 ? (
                                    <div className="space-y-4">
                                        {doctors.map((doctor) => (
                                            <div key={doctor._id} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                        {doctor.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">Dr. {doctor.name}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">{doctor.specialization || 'General Physician'}</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleConnect(doctor._id)}
                                                    disabled={requesting === doctor._id}
                                                    className="gap-2"
                                                >
                                                    {requesting === doctor._id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <UserPlus className="h-3 w-3" />
                                                    )}
                                                    Connect
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No doctors available at the moment.
                                    </div>
                                )}
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>
        </Layout>
    );
}

function MoonIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    )
}
