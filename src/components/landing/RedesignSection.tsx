import { useState } from 'react';
import { Upload, X, Wand2, Palette, Home, Sparkles } from 'lucide-react';

interface RedesignSectionProps {
    id?: string;
}

export default function RedesignSection({ id = "redesign" }: RedesignSectionProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Mock functions
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedImage(ev.target?.result as string);
                setHasGenerated(false);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleGenerate = () => {
        if (!selectedImage) return;
        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            setIsGenerating(false);
            setHasGenerated(true);
        }, 3000);
    };

    return (
        <section id={id} className="py-24 bg-[#0f1021] text-white transition-all duration-500 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
                        Experience the Magic of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AI Redesign</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        See what others are creating and try it yourself. No signup required for test drive.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: Community Gallery */}
                    <div className="hidden lg:block lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                                <Sparkles className="text-purple-500" size={20} /> Community Gallery
                            </h3>
                            <span className="text-xs text-purple-400 font-medium tracking-wide uppercase">Live Feed</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer shadow-lg hover:shadow-purple-500/20 transition-all border border-gray-800 hover:border-purple-500/50">
                                    <img
                                        src={`https://images.unsplash.com/photo-${1600000000000 + i * 1000}?auto=format&fit=crop&w=300&q=80`}
                                        alt="Community Design"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                    {i % 2 === 0 && (
                                        <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">Before/After</span>
                                    )}
                                    <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" className="w-5 h-5 rounded-full border border-white/50" />
                                        <span className="text-[10px] text-gray-200 truncate">Modern Living Room</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Redesign Panel */}
                    <div className="col-span-1 lg:col-span-7">
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-800 relative group-hover:border-purple-500/50 transition-colors">
                            {/* Decorative Glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

                            {/* Header */}
                            <div className="p-8 border-b border-gray-800 bg-gray-900/80">
                                <h3 className="text-2xl font-bold text-white mb-2">Start Redesigning Your Space</h3>
                                <p className="text-gray-400 text-sm">Upload a photo and let our AI transform it in seconds.</p>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* STEP 1: Upload */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-sm">1</div>
                                        <h4 className="text-lg font-semibold text-gray-200">Upload Source Image</h4>
                                    </div>

                                    {!selectedImage ? (
                                        <label className="border-2 border-dashed border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-gray-800/50 transition-all group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg z-10">
                                                <Upload className="text-purple-500" size={32} />
                                            </div>
                                            <p className="text-lg font-medium text-white mb-2 z-10">Click to upload or drag and drop</p>
                                            <p className="text-sm text-gray-500 z-10">JPG, PNG up to 10MB</p>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden shadow-2xl group border border-gray-700">
                                            <img src={selectedImage} alt="Selected" className="w-full max-h-[400px] object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                            <button
                                                onClick={() => { setSelectedImage(null); setHasGenerated(false); }}
                                                className="absolute top-4 right-4 bg-black/50 hover:bg-red-500/80 text-white p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* STEP 2: Customize */}
                                <div className={`space-y-4 transition-all duration-500 ${!selectedImage ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-sm">2</div>
                                        <h4 className="text-lg font-semibold text-gray-200">Customize AI Preferences</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Room Type</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500"><Home size={18} /></div>
                                                <select className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow">
                                                    <option>Living Room</option>
                                                    <option>Bedroom</option>
                                                    <option>Kitchen</option>
                                                    <option>Office</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Design Style</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500"><Palette size={18} /></div>
                                                <select className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow">
                                                    <option>Modern</option>
                                                    <option>Minimalist</option>
                                                    <option>Scandinavian</option>
                                                    <option>Luxury</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/50 p-5 rounded-xl space-y-4 border border-gray-700/50">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-3">AI Intervention Level</label>
                                            <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                                <span>Subtle</span>
                                                <span>Balanced</span>
                                                <span>Extreme</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedImage || isGenerating}
                                    className={`
                                        w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden group
                                        ${!selectedImage || isGenerating
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 ring-1 ring-white/10'}
                                    `}
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-3">
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span className="animate-pulse">Designing Space...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                            <Wand2 size={24} className={!selectedImage ? '' : 'animate-pulse'} />
                                            Generate Design
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* GENERATED RESULTS */}
                        {hasGenerated && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Sparkles className="text-yellow-400" /> Generated Results</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2].map((resultId) => (
                                        <div key={resultId} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 group hover:border-purple-500/30 transition-colors">
                                            <div className="relative aspect-[4/3] bg-gray-800 overflow-hidden">
                                                <img
                                                    src={`https://images.unsplash.com/photo-${resultId === 1 ? '1600210492486-724fe5c67fb0' : '1600121848594-d8644e57acee'}?auto=format&fit=crop&w=800&q=80`}
                                                    alt="Result"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full text-white border border-white/10">
                                                    Variation {resultId}
                                                </div>
                                            </div>
                                            <div className="p-4 flex gap-3">
                                                <button className="flex-1 py-2 bg-white text-gray-900 font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors shadow-sm">
                                                    Use Template
                                                </button>
                                                <button className="px-4 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-300 transition-colors">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
