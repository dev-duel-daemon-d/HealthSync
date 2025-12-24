import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Key, Save } from 'lucide-react';
import api from '@/services/api';

export default function Profile() {
    const { user: authUser } = useAuth();
    // We keep local state for the form, initialized with authUser context data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        specialization: '',
        licenseNumber: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (authUser) {
            setFormData(prev => ({
                ...prev,
                name: authUser.name || '',
                email: authUser.email || '',
                role: authUser.role || '',
                specialization: authUser.specialization || '',
                licenseNumber: authUser.licenseNumber || ''
            }));
        }
    }, [authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                name: formData.name,
            };

            if (formData.role === 'doctor') {
                payload.specialization = formData.specialization;
                payload.licenseNumber = formData.licenseNumber;
            }

            if (formData.newPassword) {
                 if (formData.newPassword !== formData.confirmPassword) {
                    setMessage({ type: 'error', text: 'New passwords do not match' });
                    setLoading(false);
                    return;
                 }
                 // Ideally we should verify current password here or in backend
                 payload.password = formData.newPassword;
            }

            await api.put('/auth/profile', payload);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            // Optionally update context if we had a setUser exposed or force reload
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                    </div>
                </div>

                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your personal information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input 
                                            id="name" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            placeholder="John Doe" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input 
                                            id="email" 
                                            name="email" 
                                            value={formData.email} 
                                            disabled 
                                            className="bg-muted" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input 
                                            id="role" 
                                            value={formData.role} 
                                            disabled 
                                            className="capitalize bg-muted" 
                                        />
                                    </div>
                                    {formData.role === 'doctor' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="specialization">Specialization</Label>
                                                <Input 
                                                    id="specialization" 
                                                    name="specialization" 
                                                    value={formData.specialization} 
                                                    onChange={handleChange} 
                                                    placeholder="Cardiology, General Practice..." 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="licenseNumber">License Number</Label>
                                                <Input 
                                                    id="licenseNumber" 
                                                    name="licenseNumber" 
                                                    value={formData.licenseNumber} 
                                                    onChange={handleChange} 
                                                    placeholder="MD-12345" 
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
                                {message.text && (
                                    <div className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <Button onClick={handleProfileUpdate} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password securely.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input 
                                        id="newPassword" 
                                        name="newPassword" 
                                        type="password" 
                                        value={formData.newPassword} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        type="password" 
                                        value={formData.confirmPassword} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
                                {message.text && (
                                    <div className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <Button onClick={handleProfileUpdate} disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
