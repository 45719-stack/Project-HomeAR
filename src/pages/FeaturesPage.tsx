import { Wand2, Layout, Sofa, Check, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthGate } from '../hooks/useAuthGate';
import PaywallModal from '../components/PaywallModal';

export default function FeaturesPage() {
    const navigate = useNavigate();
    const { requireAuth } = useAuthGate();
    const [showPaywall, setShowPaywall] = useState(false);
    const [userPlan] = useState<string>(() => localStorage.getItem('plan') || 'free');

    const features = [
        {
            title: "AI Room Redesign",
            icon: Wand2,
            desc: "Instantly reimagine any room in various styles like Modern, Minimalist, or Luxury.",
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
            features: ["Real-time transformation", "Multiple style presets", "Preserves structural integrity"],
            action: 'redesign',
            premium: false
        },
        {
            title: "Creative Makeover",
            icon: Layout,
            desc: "Go beyond structure. Change walls, floors, and layouts with creative freedom.",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
            features: ["Custom instructions", "Layout adjustment", "Color palette generation"],
            action: 'makeover',
            premium: true
        },
        {
            title: "Furniture & Décor",
            icon: Sofa,
            desc: "Fill empty rooms or replace old furniture with modern, available pieces.",
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&w=800&q=80",
            features: ["1-click furnish", "Remove objects", "Local vendor matching"],
            action: 'furniture',
            premium: true
        }
    ];

    const handleFeatureClick = (feature: typeof features[0]) => {
        if (feature.premium) {
            // 1. Auth Gate (Logged Out)
            if (!requireAuth(feature.title)) return;

            // 2. Premium Gate (Logged In, Free Plan)
            // Re-read plan from storage to be sure
            const currentPlan = localStorage.getItem('plan') || 'free';
            if (currentPlan === 'free') {
                setShowPaywall(true);
                return;
            }
        }

        // Navigation Logic
        navigate('/redesign', {
            state: {
                mode: feature.action,
                focusUpload: true
            }
        });
    };

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors">
            {/* HERRO */}
            <header className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                    Powerful AI Tools for <br className="hidden sm:block" />
                    <span className="text-primary-600 dark:text-primary-400">Home Renovation</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    From instant redesigns to precise cost estimation, HomeAR gives you everything you need to transform your space.
                </p>
            </header>

            {/* FEATURE CARDS */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            onClick={() => handleFeatureClick(feature)}
                            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-none dark:border dark:border-gray-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ring-1 ring-gray-100 dark:ring-gray-800 hover:ring-primary-500/50"
                        >
                            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white">
                                        <feature.icon size={24} />
                                    </div>
                                </div>
                                {feature.premium && (
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        {userPlan === 'free' && (
                                            <div className="bg-black/50 text-white p-1 rounded-full backdrop-blur-md">
                                                <Lock size={16} />
                                            </div>
                                        )}
                                        <div className="bg-yellow-500/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-sm flex items-center">
                                            PREMIUM
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex flex-col h-[calc(100%-12rem)]">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
                                    {feature.desc}
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {feature.features.map((item, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Check size={16} className="text-green-500 shrink-0" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                    {feature.premium && userPlan === 'free' ? (
                                        <span className="flex items-center gap-1"><Lock size={14} /> Unlock Feature</span>
                                    ) : (
                                        <span className="flex items-center">Try Now <ArrowRight size={16} className="ml-1" /></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />


        </div>
    );
}
