import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Stethoscope, Video, FileText, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DoctorDirectory from '@/components/DoctorDirectory';

export default function Education() {
    const [activeTab, setActiveTab] = useState('articles');

    const articles = [
        {
            id: 1,
            title: "Understanding Hypertension",
            category: "Heart Health",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070",
            summary: "Hypertension, or high blood pressure, is a common condition that affects the body's arteries. Learn about symptoms and prevention."
        },
        {
            id: 2,
            title: "Diabetes Management Tips",
            category: "Chronic Care",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2080",
            summary: "Effective strategies for managing blood sugar levels through diet, exercise, and medication adherence."
        },
        {
            id: 3,
            title: "The Importance of Sleep",
            category: "Wellness",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1541781777621-af13943727dd?auto=format&fit=crop&q=80&w=2070",
            summary: "Good sleep improves your brain performance, mood, and health. Discover how to improve your sleep hygiene."
        },
        {
            id: 4,
            title: "Mental Health Basics",
            category: "Mental Health",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=2090",
            summary: "Recognizing the signs of anxiety and depression, and knowing when to seek professional help."
        }
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Health Resources</h1>
                    <p className="text-muted-foreground">Trusted medical information and specialist directory.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="articles" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Articles & Guides
                        </TabsTrigger>
                        <TabsTrigger value="doctors" className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Find Specialists
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="articles" className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {articles.map((article) => (
                                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                        <img 
                                            src={article.image} 
                                            alt={article.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <Badge className="absolute top-4 left-4 z-20 bg-white/90 text-black hover:bg-white">
                                            {article.category}
                                        </Badge>
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {article.readTime}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                                            {article.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm line-clamp-2">
                                            {article.summary}
                                        </p>
                                        <Button variant="link" className="px-0 mt-4 text-blue-600">
                                            Read Article <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="doctors" className="animate-fade-in">
                        <DoctorDirectory />
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
