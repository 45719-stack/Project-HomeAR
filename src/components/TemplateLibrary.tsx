import { useState } from 'react';
import { Lock, Zap, Crown } from 'lucide-react';

export type Plan = 'free' | 'premium' | 'ultra';

export interface Template {
    id: string;
    name: string;
    image: string;
    tier: Plan;
    filter: string;
}

interface TemplateLibraryProps {
    userPlan: Plan;
    onSelect: (template: Template) => void;
}

export const TEMPLATES: Template[] = [
    // FREE
    { id: 'f1', name: 'Modern Bright', tier: 'free', filter: 'brightness(1.1) contrast(1.1) saturate(1.2)', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80' },
    { id: 'f2', name: 'Cozy Warm', tier: 'free', filter: 'sepia(0.3) saturate(1.4) contrast(0.9)', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=400&q=80' },
    { id: 'f3', name: 'B&W Minimal', tier: 'free', filter: 'grayscale(1) contrast(1.2)', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=80' },

    // PREMIUM
    { id: 'p1', name: 'Luxury Gold', tier: 'premium', filter: 'contrast(1.1) brightness(1.05) sepia(0.2) saturate(1.1)', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80' },
    { id: 'p2', name: 'Vibrant Pop', tier: 'premium', filter: 'saturate(2) contrast(1.1)', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80' },
    { id: 'p3', name: 'Dark Moody', tier: 'premium', filter: 'brightness(0.8) contrast(1.3) saturate(0.8)', image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c26?auto=format&fit=crop&w=400&q=80' },

    // ULTRA
    { id: 'u1', name: 'Royal Elegance', tier: 'ultra', filter: 'sepia(0.1) saturate(1.5) contrast(1.2) brightness(1.1)', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=400&q=80' },
    { id: 'u2', name: 'Future Tech', tier: 'ultra', filter: 'hue-rotate(180deg) saturate(1.5) contrast(1.2)', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=400&q=80' },
];

export default function TemplateLibrary({ userPlan, onSelect }: TemplateLibraryProps) {
    const [activeTab, setActiveTab] = useState<Plan>('free');

    const filteredTemplates = TEMPLATES.filter(t => t.tier === activeTab);

    const isLocked = (templateTier: Plan) => {
        if (userPlan === 'ultra') return false;
        if (userPlan === 'premium' && templateTier !== 'ultra') return false;
        if (userPlan === 'free' && templateTier === 'free') return false;
        return true;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {(['free', 'premium', 'ultra'] as Plan[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            flex-1 py-2 px-4 rounded-lg text-sm font-semibold capitalize transition-all
                            ${activeTab === tab
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => {
                    const locked = isLocked(template.tier);
                    return (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template)}
                            className="group relative cursor-pointer"
                        >
                            <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group-hover:shadow-md transition-all">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${locked ? 'grayscale' : ''}`}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80'; // Fallback
                                    }}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                                <span className="absolute bottom-2 left-2 text-white text-xs font-bold">
                                    {template.name}
                                </span>

                                {/* Badge */}
                                <div className="absolute top-2 right-2">
                                    {template.tier === 'premium' && <div className="bg-yellow-500/90 text-white p-1 rounded-full"><Zap size={12} fill="currentColor" /></div>}
                                    {template.tier === 'ultra' && <div className="bg-purple-500/90 text-white p-1 rounded-full"><Crown size={12} fill="currentColor" /></div>}
                                </div>

                                {/* Lock Overlay */}
                                {locked && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                                            <Lock className="text-white" size={24} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
