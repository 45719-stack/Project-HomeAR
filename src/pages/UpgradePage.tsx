import { useState } from 'react';
import { Check, X, Shield, Zap, Crown, type LucideIcon } from 'lucide-react';

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    icon: LucideIcon;
    color?: string;
    planId: 'premium' | 'ultra';
    currentPlan: 'free' | 'premium' | 'ultra';
    onUpgrade: (plan: 'premium' | 'ultra') => void;
    recommended?: boolean;
    billingCycle: 'monthly' | 'yearly';
}

const PricingCard = ({
    title,
    price,
    features,
    icon: Icon,
    color,
    planId,
    currentPlan,
    onUpgrade,
    recommended = false,
    billingCycle
}: PricingCardProps) => (
    <div className={`relative bg-white dark:bg-gray-900 rounded-2xl p-8 border hover:-translate-y-2 transition-transform duration-300 flex flex-col ${recommended ? 'border-primary-500 shadow-xl shadow-primary-500/10' : 'border-gray-200 dark:border-gray-800 shadow-lg'}`}>
        {recommended && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Most Popular
            </div>
        )}

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
            <Icon size={32} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{price}</span>
            <span className="text-gray-500 dark:text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm font-medium">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    {feature}
                </li>
            ))}
        </ul>

        <button
            onClick={() => onUpgrade(planId)}
            disabled={currentPlan === planId || (currentPlan === 'ultra' && planId === 'premium')}
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${currentPlan === planId
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default'
                : (currentPlan === 'ultra' && planId === 'premium')
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-95'
                }`}
        >
            {currentPlan === planId ? 'Current Plan' : 'Upgrade Now'}
        </button>
    </div>
);

export default function UpgradePage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    // Lazy initialization to avoid useEffect
    const [currentPlan, setCurrentPlan] = useState<'free' | 'premium' | 'ultra'>(() => {
        const plan = localStorage.getItem('plan');
        return (plan === 'premium' || plan === 'ultra') ? plan : 'free';
    });

    const handleUpgrade = (plan: 'premium' | 'ultra') => {
        localStorage.setItem('plan', plan);
        setCurrentPlan(plan);
        // Dispatch event for Navbar update
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Choose the Perfect Plan for <span className="text-primary-600 dark:text-primary-400">Your Dream Home</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-10">
                        Unlock powerful AI features, unlimited designs, and direct access to top-rated professionals.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex items-center bg-white dark:bg-gray-900 rounded-full p-1 shadow-md border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Yearly <span className="ml-1 text-green-500 text-xs">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 flex flex-col opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center mb-6">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">Free</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm font-medium"><Check size={18} className="text-green-500 shrink-0" /> Access to Basic Templates</li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm font-medium"><Check size={18} className="text-green-500 shrink-0" /> 3 AI Redesigns per day</li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm font-medium"><Check size={18} className="text-green-500 shrink-0" /> View Vendor Profiles</li>
                            <li className="flex items-start gap-3 text-gray-400 text-sm font-medium"><X size={18} className="shrink-0" /> Contact Vendors Directly</li>
                            <li className="flex items-start gap-3 text-gray-400 text-sm font-medium"><X size={18} className="shrink-0" /> High-Res Downloads</li>
                        </ul>
                        <button disabled className="w-full py-4 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                            Included
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <PricingCard
                        title="Premium"
                        price={billingCycle === 'monthly' ? "PKR 1500" : "PKR 14,400"}
                        icon={Zap}
                        color="bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400"
                        planId="premium"
                        currentPlan={currentPlan}
                        onUpgrade={handleUpgrade}
                        recommended={true}
                        billingCycle={billingCycle}
                        features={[
                            "Unlock All 150+ Templates",
                            "Unlimited AI Redesigns",
                            "Direct Vendor Contact Info",
                            "Priority Cost Estimation",
                            "High-Res Design Export",
                            "Save Unlimited Projects"
                        ]}
                    />

                    {/* Ultra Plan */}
                    <PricingCard
                        title="Ultra"
                        price={billingCycle === 'monthly' ? "PKR 3500" : "PKR 33,600"}
                        icon={Crown}
                        color="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
                        planId="ultra"
                        currentPlan={currentPlan}
                        onUpgrade={handleUpgrade}
                        billingCycle={billingCycle}
                        features={[
                            "Everything in Premium",
                            "Commercial Usage Rights",
                            "1-on-1 Design Consultation",
                            "Verified-Only Vendor Filter",
                            "Early Access to New Features",
                            "Dedicated Account Manager"
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
