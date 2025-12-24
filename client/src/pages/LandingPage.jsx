import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    Stethoscope,
    Calendar,
    Shield,
    Users,
    Award,
    Clock,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    Star,
    Activity,
} from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import logo from "../../public/favicon.png"

export default function LandingPage() {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 },
        );

        document.querySelectorAll('[id^="section-"]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleBookNow = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Floating Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-50 shadow-lg border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2 group">
                            <div className="relative">
                                {/* <Heart */}
                                {/*     className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" */}
                                {/*     fill="currentColor" */}
                                {/* /> */}
                                <img src={logo} width='50px' />
                                <div className="absolute inset-0 bg-blue-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pt-1">
                                HealthSync
                            </span>
                        </div>
                        {/* <div className="hidden md:flex gap-8"> */}
                        {/*   {['Services', 'Doctors', 'About', 'Contact'].map((item) => ( */}
                        {/*     <a */}
                        {/*       key={item} */}
                        {/*       href={`#${item.toLowerCase()}`} */}
                        {/*       className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group" */}
                        {/*     > */}
                        {/*       {item} */}
                        {/*       <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span> */}
                        {/*     </a> */}
                        {/*   ))} */}
                        {/* </div> */}
                        <button
                            onClick={handleBookNow}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div
                        className="space-y-8"
                        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                    >
                        <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium animate-bounce">
                            ⭐ Trusted by 50,000+ Patients
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                            Your Health is Our
                            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                                Priority
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Experience world-class healthcare with our team of expert doctors,
                            state-of-the-art facilities, and compassionate care.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleBookNow}
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center gap-2"
                            >
                                Schedule Appointment
                                <ChevronRight className="group-hover:translate-x-2 transition-transform duration-300" />
                            </button>
                            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-full font-medium text-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                                Learn More
                            </button>
                        </div>

                    </div>

                    <div
                        className="relative"
                        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard
                                        icon={Users}
                                        value="50K+"
                                        label="Patients"
                                        delay="0s"
                                    />
                                    <StatCard
                                        icon={Stethoscope}
                                        value="200+"
                                        label="Doctors"
                                        delay="0.1s"
                                    />
                                    <StatCard
                                        icon={Award}
                                        value="25+"
                                        label="Awards"
                                        delay="0.2s"
                                    />
                                    <StatCard
                                        icon={Clock}
                                        value="24/7"
                                        label="Support"
                                        delay="0.3s"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BackgroundBeams />
            </section>

            {/* Services Section */}
            <section
                id="section-services"
                className="py-20 px-4 bg-white dark:bg-gray-800"
            >
                <div className="max-w-7xl mx-auto">
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible["section-services"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Medical Services
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Comprehensive healthcare solutions for you and your family
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Heart,
                                title: "Cardiology",
                                desc: "Expert heart care and cardiovascular treatments",
                                color: "red",
                            },
                            {
                                icon: Activity,
                                title: "Neurology",
                                desc: "Advanced brain and nervous system care",
                                color: "purple",
                            },
                            {
                                icon: Stethoscope,
                                title: "General Medicine",
                                desc: "Primary care for all ages",
                                color: "blue",
                            },
                            {
                                icon: Shield,
                                title: "Pediatrics",
                                desc: "Specialized care for children",
                                color: "green",
                            },
                            {
                                icon: Users,
                                title: "Family Medicine",
                                desc: "Holistic care for the whole family",
                                color: "orange",
                            },
                            {
                                icon: Calendar,
                                title: "Preventive Care",
                                desc: "Regular check-ups and screenings",
                                color: "teal",
                            },
                        ].map((service, idx) => (
                            <ServiceCard
                                key={idx}
                                {...service}
                                delay={idx * 0.1}
                                visible={isVisible["section-services"]}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="section-features"
                className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
            >
                <div className="max-w-7xl mx-auto">
                    <div
                        className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible["section-features"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                    >
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                                Why Choose Us?
                            </h2>
                            {[
                                {
                                    icon: Award,
                                    title: "Expert Doctors",
                                    desc: "Board-certified physicians with decades of experience",
                                },
                                {
                                    icon: Shield,
                                    title: "Advanced Technology",
                                    desc: "State-of-the-art medical equipment and facilities",
                                },
                                {
                                    icon: Heart,
                                    title: "Compassionate Care",
                                    desc: "Patient-centered approach with personalized attention",
                                },
                                {
                                    icon: Clock,
                                    title: "24/7 Emergency",
                                    desc: "Round-the-clock emergency services available",
                                },
                            ].map((feature, idx) => (
                                <FeatureItem key={idx} {...feature} delay={idx * 0.1} />
                            ))}
                        </div>
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl hover:scale-105 hover:rotate-3 transition-all duration-500 cursor-pointer shadow-xl"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id="section-testimonials"
                className="py-20 px-4 bg-white dark:bg-gray-800"
            >
                <div className="max-w-7xl mx-auto">
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible["section-testimonials"] ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Patient Stories
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Hear from those who've experienced our care
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Johnson",
                                role: "Patient",
                                text: "The care I received was exceptional. The staff was professional and caring.",
                            },
                            {
                                name: "Michael Chen",
                                role: "Patient",
                                text: "State-of-the-art facilities and amazing doctors. Highly recommend!",
                            },
                            {
                                name: "Emily Davis",
                                role: "Patient",
                                text: "They truly care about their patients. Best healthcare experience ever.",
                            },
                        ].map((testimonial, idx) => (
                            <TestimonialCard
                                key={idx}
                                {...testimonial}
                                delay={idx * 0.1}
                                visible={isVisible["section-testimonials"]}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "50px 50px",
                        }}
                    ></div>
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Take Control of Your Health?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Schedule your appointment today and experience healthcare like never
                        before
                    </p>
                    <button
                        onClick={handleBookNow}
                        className="group px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:scale-110 hover:shadow-2xl transform transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                        Book Your Appointment
                        <ChevronRight className="group-hover:translate-x-2 transition-transform duration-300" />
                    </button>
                </div>
                <BackgroundBeams />
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            {/* <Heart className="h-8 w-8 text-blue-500" fill="currentColor" /> */}
                            <img src={logo} width='45px' />
                            <span className="text-4xl font-bold">HealthSync</span>
                        </div>
                        <p className="text-gray-400">
                            Providing exceptional healthcare services since 1995
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li className="hover:text-white transition-colors cursor-pointer">
                                About Us
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Services
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Doctors
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Careers
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Services</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Emergency Care
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Surgery
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Diagnostics
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Pharmacy
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center gap-2 hover:text-white transition-colors">
                                <Phone className="h-4 w-4" /> +1 (555) 123-4567
                            </li>
                            <li className="flex items-center gap-2 hover:text-white transition-colors">
                                <Mail className="h-4 w-4" /> info@healthsync.com
                            </li>
                            <li className="flex items-center gap-2 hover:text-white transition-colors">
                                <MapPin className="h-4 w-4" /> 123 Health St, Medical City
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>© 2024 HealthSync. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function StatCard({ icon: Icon, value, label, delay }) {
    return (
        <div
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
            style={{ animationDelay: delay }}
        >
            <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
        </div>
    );
}

function ServiceCard({ icon: Icon, title, desc, color, delay, visible }) {
    const colorStyles = {
        red: "from-red-500 to-pink-500",
        purple: "from-purple-500 to-indigo-500",
        blue: "from-blue-500 to-cyan-500",
        green: "from-green-500 to-emerald-500",
        orange: "from-orange-500 to-red-500",
        teal: "from-teal-500 to-cyan-500",
    };

    return (
        <div
            className={`group relative bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${colorStyles[color]} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
            ></div>
            <div
                className={`inline-block p-4 rounded-xl bg-gradient-to-br ${colorStyles[color]} text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
            >
                <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{desc}</p>
            <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all duration-300">
                Learn More{" "}
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}

function FeatureItem({ icon: Icon, title, desc, delay }) {
    return (
        <div
            className="flex gap-4 items-start group cursor-pointer"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
        </div>
    );
}

function TestimonialCard({ name, role, text, delay, visible }) {
    return (
        <div
            className={`bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{text}"</p>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div>
                    <div className="font-bold text-gray-900 dark:text-white">{name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{role}</div>
                </div>
            </div>
        </div>
    );
}
