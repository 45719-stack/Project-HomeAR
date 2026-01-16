import { PlayCircle, Wand2, Palette, Sofa, DollarSign, Users, Layout } from 'lucide-react';

export default function HeroSection() {
    return (
        <header className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="text-center lg:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-bold tracking-wide uppercase mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                            The Pakistan's #1 Home Design AI
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                            Redesign <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Interiors</span><br />
                            with AI, in less<br />
                            than 30 seconds
                        </h1>

                        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Upload a photo of your room and instantly redesign it. Edit furniture, colors and décor by touch. Get instant cost estimates and connect with local vendors.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => {
                                    const el = document.getElementById('templates');
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth' });
                                        el.classList.add('ring-4', 'ring-primary-500/50');
                                        setTimeout(() => el.classList.remove('ring-4', 'ring-primary-500/50'), 1000);
                                    }
                                }}
                                className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <PlayCircle size={20} /> Explore Templates
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> No credit card required</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 5 Free Generates</span>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-indigo-200 rounded-[2rem] transform rotate-3 scale-105 opacity-50 blur-xl group-hover:rotate-2 transition-transform duration-700"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                            <img
                                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                                alt="Modern Living Room Redesign"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                            />

                            {/* Overlay Interaction Mock */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Modification Steps</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Processing</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    {[Wand2, Palette, Sofa, DollarSign, Users, Layout].map((Icon, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm hover:text-primary-600 hover:border-primary-200 hover:scale-110 transition-all cursor-pointer">
                                            <Icon size={18} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
