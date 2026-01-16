import { Wand2, Layout, Sofa, Check, X, Zap, Crown } from 'lucide-react';

interface FeaturesSectionProps {
    id?: string;
}

export default function FeaturesSection({ id = "templates" }: FeaturesSectionProps) {
    return (
        <section id={id} className="py-24 bg-white dark:bg-slate-950 transition-colors scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        Powerful AI Tools for Home Renovation
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 font-light">
                        From instant redesigns to precise cost estimation, everything you need in one place.
                    </p>
                </div>

                {/* FEATURE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    {[
                        {
                            title: "AI Interior Redesign",
                            icon: Wand2,
                            desc: "Instantly reimagine any room in various styles like Modern, Minimalist, or Luxury.",
                            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&w=600&q=80",
                            features: ["Real-time transformation", "Multiple style presets", "Preserves structural integrity"]
                        },
                        {
                            title: "Creative Makeover",
                            icon: Layout,
                            desc: "Go beyond structure. Change walls, floors, and layouts with creative freedom.",
                            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
                            features: ["Custom instructions", "Layout adjustment", "Color palette generation"]
                        },
                        {
                            title: "Furniture & Vendor Match",
                            icon: Sofa,
                            desc: "Fill empty rooms or replace old furniture with modern pieces from local vendors.",
                            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
                            features: ["1-click furnish", "Remove objects", "Local vendor matching"]
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl dark:shadow-none dark:border dark:border-gray-800 overflow-hidden transition-all duration-500 hover:-translate-y-2">
                            <div className="relative h-56 overflow-hidden">
                                <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-white shadow-lg border border-white/20">
                                        <feature.icon size={24} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                                    {feature.desc}
                                </p>
                                <ul className="space-y-3">
                                    {feature.features.map((item, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MINI COMPARISON ROW */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Plans</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Free */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center hover:border-gray-300 transition-colors">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Starter</span>
                            <span className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">₨0</span>
                            <ul className="space-y-2 mb-6 w-full text-left bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                                <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-green-500" /> 5 Daily Generations</li>
                                <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-green-500" /> Standard Styles</li>
                                <li className="flex items-center gap-2 text-sm text-gray-400"><X size={14} /> No HD Export</li>
                            </ul>
                        </div>

                        {/* Premium */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-950 border-2 border-primary-500 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-primary-500"></div>
                            <span className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2 flex items-center gap-1">Premium <Zap size={14} className="fill-primary-600" /></span>
                            <span className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">₨2,500</span>
                            <ul className="space-y-2 mb-6 w-full text-left bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
                                <li className="flex items-center gap-2 text-sm font-medium"><Check size={14} className="text-green-500" /> Unlimited Gens</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><Check size={14} className="text-green-500" /> All Styles + Edit</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><Check size={14} className="text-green-500" /> HD Export</li>
                            </ul>
                        </div>

                        {/* Ultra */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center hover:border-purple-300 transition-colors">
                            <span className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-1">Ultra <Crown size={14} className="fill-purple-100" /></span>
                            <span className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">₨5,000</span>
                            <ul className="space-y-2 mb-6 w-full text-left bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                                <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-green-500" /> Commercial Lic.</li>
                                <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-green-500" /> Priority Support</li>
                                <li className="flex items-center gap-2 text-sm"><Check size={14} className="text-green-500" /> Top Vendors</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
