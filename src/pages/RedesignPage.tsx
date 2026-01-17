import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Upload, Wand2, Crown, Loader2, X, AlertCircle, Move3d,
    Grid, ArrowLeft, Save, PanelLeft, Download,
    RefreshCw, RotateCcw, MousePointer2, Move, Maximize, Copy, Trash2, Lock, Unlock,
    Armchair, Lamp, BedDouble, Table, Box, Sprout, ChevronDown
} from 'lucide-react';
import TemplateLibrary, { TEMPLATES } from '../components/TemplateLibrary';
import ThreeRoomBuilder, { type FurnitureItem, type WallConfig } from '../components/ThreeRoomBuilder';
import type { Plan, Template } from '../components/TemplateLibrary';
import { useAuthGate } from '../hooks/useAuthGate';
import { saveProject } from '../services/projectService';


// Furniture Catalog Configuration
const FURNITURE_CATALOG = [
    { type: 'sofa', name: 'Modern Sofa', dims: [2.2, 0.8, 0.9], color: '#334155', icon: Armchair },
    { type: 'table', name: 'Coffee Table', dims: [1.2, 0.4, 0.6], color: '#854d0e', icon: Table },
    { type: 'chair', name: 'Accent Chair', dims: [0.8, 0.9, 0.8], color: '#475569', icon: Armchair },
    { type: 'bed', name: 'Queen Bed', dims: [1.6, 1.0, 2.0], color: '#cbd5e1', icon: BedDouble },
    { type: 'lamp', name: 'Floor Lamp', dims: [0.4, 1.6, 0.4], color: '#f59e0b', icon: Lamp },
    { type: 'storage', name: 'Cabinet', dims: [1.0, 1.8, 0.4], color: '#475569', icon: Box },
    { type: 'rug', name: 'Area Rug', dims: [3.0, 0.02, 2.0], color: '#e2e8f0', icon: Grid },
    { type: 'decor', name: 'Decor Sphere', dims: [0.3, 0.3, 0.3], color: '#ec4899', icon: Wand2 },
];

export default function RedesignPage() {
    // Application State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [userPlan, setUserPlan] = useState<Plan>('free');
    const [isGenerating, setIsGenerating] = useState(false);
    const { requireAuth } = useAuthGate();
    const location = useLocation();

    // AI Configuration State
    const [roomType, setRoomType] = useState('Living Room');
    const [designStyle, setDesignStyle] = useState('Modern');
    const [interventionLevel, setInterventionLevel] = useState<number>(50); // 0-100
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    // Generation State
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [generationStep, setGenerationStep] = useState<string>('');

    // Manual Design (3D) State
    const [activeTab, setActiveTab] = useState<'ai' | 'self'>('ai');
    const [manualStep, setManualStep] = useState<1 | 2 | 3>(1);
    const [roomDims, setRoomDims] = useState({ width: 12, height: 9, length: 12, unit: 'ft' });

    // Enhanced 3D State
    const [wallConfig, setWallConfig] = useState<WallConfig>({
        front: '#f3f4f6', back: '#f3f4f6', left: '#f3f4f6', right: '#f3f4f6',
        ceiling: '#ffffff'
    });
    const [floorType, setFloorType] = useState<'wood' | 'tile' | 'carpet' | 'marble'>('wood');
    const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);

    // Editor UI State
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [selectionType, setSelectionType] = useState<'furniture' | 'wall' | 'floor' | null>(null);
    const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [editorTab, setEditorTab] = useState<'catalog' | 'properties' | 'settings'>('catalog');

    // UI State
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    // Initialize state
    useEffect(() => {
        const storedPlan = localStorage.getItem('plan') as Plan;
        if (storedPlan) {
            setUserPlan(storedPlan);
        }
        if (location.state?.mode) {
            setActiveTab('ai');
            if (location.state.focusUpload) {
                const uploadSection = document.getElementById('upload-section');
                if (uploadSection) uploadSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    // --- Handlers for AI Flow (existing) ---
    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            showToast("Please upload an image file");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast("File size too large (max 10MB)");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setResultImage(null);
    };

    const handleGenerate = async () => {
        if (!selectedImage) return;
        const token = localStorage.getItem('token');
        if (!token) {
            setShowLoginModal(true);
            return;
        }
        setIsGenerating(true);
        setGenerationStep('Uploading reference image...');
        try {
            await new Promise(r => setTimeout(r, 800));
            setGenerationStep('Analyzing room structure...');
            await new Promise(r => setTimeout(r, 1000));
            setGenerationStep('Applying design style...');
            await new Promise(r => setTimeout(r, 1200));
            setGenerationStep('Finalizing render...');
            await new Promise(r => setTimeout(r, 600));

            const activeTemplate = selectedTemplate || TEMPLATES[0];
            await new Promise(r => setTimeout(r, 100));
            setResultImage(activeTemplate.image);
            showToast("Design generated successfully!");
        } catch (error) {
            console.error(error);
            showToast("Failed to generate design. Please try again.");
        } finally {
            setIsGenerating(false);
            setGenerationStep('');
        }
    };

    const handleDownload = () => {
        if (resultImage) {
            const link = document.createElement('a');
            link.href = resultImage;
            link.download = `homear-redesign-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("Image downloaded!");
        }
    };

    const handleReset = () => {
        setResultImage(null);
    };

    // --- Handlers for 3D Manual Design ---
    const handleBuildRoom = () => {
        setManualStep(2);
        setTimeout(() => {
            setManualStep(3);
        }, 1500);
    };

    const handleBackToDims = () => {
        if (furnitureItems.length > 0) {
            setShowExitConfirm(true);
        } else {
            setManualStep(1);
        }
    };

    const confirmExit = () => {
        setFurnitureItems([]);
        setWallConfig({ front: '#f3f4f6', back: '#f3f4f6', left: '#f3f4f6', right: '#f3f4f6', ceiling: '#ffffff' });
        setShowExitConfirm(false);
        setManualStep(1);
    };

    // 3D Actions
    const handleAddFurniture = (type: string) => {
        const catalogItem = FURNITURE_CATALOG.find(c => c.type === type);
        if (!catalogItem) return;

        const newItem: FurnitureItem = {
            id: crypto.randomUUID(),
            type,
            name: catalogItem.name,
            position: [0, 0, 0], // Center
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: catalogItem.color,
            dimensions: catalogItem.dims as [number, number, number],
            locked: false
        };

        setFurnitureItems([...furnitureItems, newItem]);
        setSelectedItemId(newItem.id);
        setSelectionType('furniture');
        setEditorTab('properties');
        showToast(`Added ${catalogItem.name}`);
    };

    const handleDuplicateItem = () => {
        const item = furnitureItems.find(i => i.id === selectedItemId);
        if (!item) return;
        const newItem: FurnitureItem = {
            ...item,
            id: crypto.randomUUID(),
            position: [item.position[0] + 0.5, item.position[1], item.position[2] + 0.5] as [number, number, number]
        };
        setFurnitureItems([...furnitureItems, newItem]);
        setSelectedItemId(newItem.id);
        showToast("Item duplicated");
    };

    const handleDeleteItem = () => {
        if (!selectedItemId) return;
        setFurnitureItems(furnitureItems.filter(i => i.id !== selectedItemId));
        setSelectedItemId(null);
        setSelectionType(null);
        showToast("Item deleted");
    };

    const handleUpdateItem = (updatedItem: FurnitureItem) => {
        setFurnitureItems(furnitureItems.map(i => i.id === updatedItem.id ? updatedItem : i));
    };

    const handleSelect = (id: string | null, type: 'furniture' | 'wall' | 'floor' | null) => {
        setSelectedItemId(id);
        setSelectionType(type);
        if (id) setEditorTab('properties');
    };

    // Helper: Toast
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleTemplateSelect = (template: Template) => {
        if (template.tier !== 'free') {
            if (!requireAuth(template.tier + ' templates')) return;
        }
        if (userPlan === 'free' && template.tier !== 'free') {
            navigate('/upgrade');
            return;
        }
        if (activeTab === 'ai' && !selectedImage) {
            showToast("Please upload a room image first");
            return;
        }
        setSelectedTemplate(template);
        showToast(`Applied ${template.name} style`);
    };

    // Get selected furniture object for property panel
    const selectedItem = furnitureItems.find(i => i.id === selectedItemId);

    const handleSaveProject = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowLoginModal(true);
            return;
        }

        // Construct project data
        const projectData = {
            roomType: manualStep < 3 ? roomType : "Custom Room",
            designStyle: activeTab === 'ai' ? designStyle : "Manual",
            dimensions: roomDims,
            wallConfig,
            floorType,
            furnitureItems,
            snapshot: resultImage || null
        };

        try {
            showToast("Saving project...");
            await saveProject(projectData);
            showToast("Project saved successfully!");
        } catch (error) {
            console.error(error);
            if (error instanceof Error && error.message.includes('permission-denied')) {
                showToast("Permission denied: Firestore rules blocked request.");
            } else {
                showToast("Failed to save project.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors pb-20 font-sans">
            {toastMessage && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[70] bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {toastMessage}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header (Hidden in Fullscreen Editor) */}
                {(!activeTab || activeTab === 'ai' || manualStep < 3) && (
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Design Studio</h1>
                        <p className="text-gray-500 dark:text-gray-400">Transform your space with AI or customize it manually.</p>
                    </div>
                )}

                {/* Tabs */}
                {(!activeTab || activeTab === 'ai' || manualStep < 3) && (
                    <div className="flex justify-center mb-8">
                        <div className="bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 inline-flex">
                            <button onClick={() => setActiveTab('ai')} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'ai' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Design with AI</button>
                            <button onClick={() => setActiveTab('self')} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'self' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Self Design (Manual)</button>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: WORKSPACE / EDITOR AREA */}
                        <div className="col-span-1 lg:col-span-8 space-y-6">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                                {/* Header */}
                                <div className="h-14 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 justify-between bg-white dark:bg-gray-900">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                                        <Wand2 size={18} className="text-primary-500" /> AI Workspace
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium">{resultImage ? 'Result Preview' : 'Step-by-step Design'}</div>
                                </div>

                                <div className="p-6 space-y-8">
                                    {resultImage ? (
                                        // RESULT VIEW
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-500 uppercase">Original</span></div>
                                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative group"><img src={selectedImage!} alt="Original" className="w-full h-full object-cover" /></div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase flex items-center gap-2"><Wand2 size={12} /> Redesigned</span>
                                                        <span className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-2 py-0.5 rounded-full">Preview (Mock)</span>
                                                    </div>
                                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative group shadow-lg shadow-primary-500/10 border-2 border-primary-500/20"><img src={resultImage} alt="Redesigned" className="w-full h-full object-cover" /></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <button onClick={handleDownload} className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"><Download size={18} /> Download Result</button>
                                                <button onClick={handleGenerate} className="flex-1 py-3 bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl font-bold text-sm hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center gap-2"><RefreshCw size={18} /> Regenerate</button>
                                                <button onClick={handleReset} className="px-4 py-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"><RotateCcw size={18} /> Reset</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // UPLOAD & GENERATE STEPS (truncated for brevity, assumes identical to before)
                                        <div className="space-y-6">
                                            {/* Step 1: Upload */}
                                            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                                                {!selectedImage ? (
                                                    <div
                                                        onDrop={handleDrop}
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        className={`cursor-pointer transition-colors ${isDragOver ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500' : ''}`}
                                                    >
                                                        <label className="cursor-pointer flex flex-col items-center">
                                                            <Upload size={32} className="text-gray-400 mb-2" />
                                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload room image</span>
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative aspect-video rounded-lg overflow-hidden">
                                                        <img src={selectedImage} className="w-full h-full object-cover" />
                                                        <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"><X size={16} /></button>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Step 2: Customize */}
                                            {selectedImage && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-xs uppercase text-gray-500">Room Type</label>
                                                            <select value={roomType} onChange={e => setRoomType(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border-none">
                                                                <option>Living Room</option><option>Bedroom</option><option>Kitchen</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs uppercase text-gray-500">Style</label>
                                                            <select value={designStyle} onChange={e => setDesignStyle(e.target.value)} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border-none">
                                                                <option>Modern</option><option>Luxury</option><option>Cozy</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <div className="flex justify-between">
                                                            <label className="text-xs uppercase text-gray-500">AI Intervention</label>
                                                            <span className="text-xs font-bold text-primary-600">{interventionLevel}%</span>
                                                        </div>
                                                        <input type="range" min="0" max="100" value={interventionLevel} onChange={e => setInterventionLevel(+e.target.value)} className="w-full accent-primary-600" />
                                                    </div>
                                                </>
                                            )}
                                            {/* Step 3: Generate */}
                                            <button
                                                onClick={handleGenerate}
                                                disabled={!selectedImage || isGenerating}
                                                className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${!selectedImage ? 'bg-gray-300' : 'bg-primary-600 hover:bg-primary-500'}`}
                                            >
                                                {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                                {isGenerating ? generationStep : 'Generate Design'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* RIGHT: Template Library */}
                        <div className="col-span-1 lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Wand2 className="text-primary-500" size={20} /> Design Library</h2>
                                <TemplateLibrary userPlan={userPlan} onSelect={handleTemplateSelect} />
                            </div>
                        </div>
                    </div>
                ) : (
                    // MANUAL: STEP 1 & 2
                    manualStep < 3 ? (
                        <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-80px)] w-full p-6 animate-in fade-in duration-500">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 w-full max-w-3xl mt-4">
                                {manualStep === 1 ? (
                                    <div className="space-y-8">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-3xl font-bold dark:text-white">Room Dimensions</h3>
                                            <p className="text-base text-gray-500 dark:text-gray-400">Define the size of your space to start designing.</p>
                                            <p className="text-xs text-primary-500 font-medium bg-primary-50 dark:bg-primary-900/20 py-1 px-3 rounded-full inline-block">Example: 12 x 10 x 12 feet</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Width</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={roomDims.width}
                                                        onChange={e => setRoomDims({ ...roomDims, width: Math.max(0, +e.target.value) })}
                                                        className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold text-lg text-gray-900 dark:text-white placeholder-gray-400"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Height</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={roomDims.height}
                                                        onChange={e => setRoomDims({ ...roomDims, height: Math.max(0, +e.target.value) })}
                                                        className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold text-lg text-gray-900 dark:text-white placeholder-gray-400"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Length</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={roomDims.length}
                                                        onChange={e => setRoomDims({ ...roomDims, length: Math.max(0, +e.target.value) })}
                                                        className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold text-lg text-gray-900 dark:text-white placeholder-gray-400"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Unit</label>
                                                    <div className="relative">
                                                        <select
                                                            value={roomDims.unit}
                                                            onChange={e => setRoomDims({ ...roomDims, unit: e.target.value })}
                                                            className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold text-lg text-gray-900 dark:text-white appearance-none cursor-pointer"
                                                        >
                                                            <option value="ft">Feet</option>
                                                            <option value="m">Meters</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                                                            <ChevronDown size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleBuildRoom}
                                            disabled={!roomDims.width || !roomDims.height || !roomDims.length}
                                            className="w-full h-14 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 transform hover:scale-[1.01] active:scale-[0.99]"
                                        >
                                            <Box size={24} /> Create Room Space
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <Loader2 className="animate-spin w-16 h-16 text-primary-500 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold dark:text-white mb-2">Building 3D Environment...</h3>
                                        <p className="text-lg text-gray-500">Preparing your virtual room.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null
                )}
            </div>

            {/* FULL SCREEN 3D EDITOR (Step 3) */}
            {activeTab === 'self' && manualStep === 3 && (
                <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col animate-in fade-in duration-300">
                    {showExitConfirm && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full">
                                <h3 className="text-lg font-bold mb-2 dark:text-white">Exit Editor?</h3>
                                <p className="mb-4 text-gray-500">Unsaved changes will be lost.</p>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowExitConfirm(false)} className="px-4 py-2 rounded text-gray-500 hover:bg-gray-100">Cancel</button>
                                    <button onClick={confirmExit} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Exit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TOP BAR */}
                    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm z-40">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBackToDims} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"><ArrowLeft size={18} /> <span className="text-sm font-medium">Back</span></button>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>
                            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <button onClick={() => setTransformMode('translate')} className={`p-2 rounded ${transformMode === 'translate' ? 'bg-white dark:bg-gray-700 shadow text-primary-500' : 'text-gray-500'}`} title="Move"><Move size={18} /></button>
                                <button onClick={() => setTransformMode('rotate')} className={`p-2 rounded ${transformMode === 'rotate' ? 'bg-white dark:bg-gray-700 shadow text-primary-500' : 'text-gray-500'}`} title="Rotate"><RefreshCw size={18} /></button>
                                <button onClick={() => setTransformMode('scale')} className={`p-2 rounded ${transformMode === 'scale' ? 'bg-white dark:bg-gray-700 shadow text-primary-500' : 'text-gray-500'}`} title="Scale"><Maximize size={18} /></button>
                            </div>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>
                            <div className="flex gap-1">
                                <button onClick={() => handleSelect(null, null)} className="p-2 text-gray-500 hover:text-gray-900" title="Deselect All"><MousePointer2 size={18} /></button>
                                <button onClick={handleDeleteItem} disabled={!selectedItemId} className="p-2 text-red-500 disabled:opacity-30 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18} /></button>
                                <button onClick={handleDuplicateItem} disabled={!selectedItemId} className="p-2 text-blue-500 disabled:opacity-30 hover:bg-blue-50 rounded" title="Duplicate"><Copy size={18} /></button>
                            </div>
                        </div>
                        <button onClick={handleSaveProject} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-500 flex items-center gap-2"><Save size={18} /> Save Project</button>
                    </div>

                    <div className="flex-1 flex relative overflow-hidden">
                        {/* LEFT SIDEBAR: CATALOG */}
                        <div className={`relative z-30 transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
                            {isSidebarOpen && (
                                <div className="h-full flex flex-col">
                                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                                        <button onClick={() => setEditorTab('catalog')} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${editorTab === 'catalog' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>Catalog</button>
                                        <button onClick={() => setEditorTab('properties')} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${editorTab === 'properties' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>Properties</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                        {editorTab === 'catalog' ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {FURNITURE_CATALOG.map((item, idx) => (
                                                    <button key={idx} onClick={() => handleAddFurniture(item.type)} className="flex flex-col items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group text-gray-600 dark:text-gray-300">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2 text-primary-500 group-hover:scale-110 transition-transform">
                                                            <item.icon size={20} />
                                                        </div>
                                                        <span className="text-xs font-semibold text-center">{item.name}</span>
                                                    </button>
                                                ))}
                                                <div className="col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Room Elements</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => setWallConfig(p => ({ ...p, [selectionType === 'wall' && selectedItemId ? selectedItemId : 'front']: p.floor === '#333' ? '#f3f4f6' : '#bfdbfe' }))}
                                                            className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
                                                        >
                                                            <Sprout size={16} className="mb-1 text-green-500" />
                                                            <span className="text-xs">Plants</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setFloorType(f => f === 'wood' ? 'tile' : (f === 'tile' ? 'carpet' : (f === 'carpet' ? 'marble' : 'wood')))}
                                                            className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
                                                        >
                                                            <Grid size={16} className="mb-1 text-amber-600" />
                                                            <span className="text-xs capitalize">{floorType}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {selectedItemId && selectionType === 'furniture' && selectedItem ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded text-primary-600"><Move3d size={18} /></div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 dark:text-white">{selectedItem.name}</h3>
                                                                <p className="text-xs text-gray-500">ID: {selectedItem.id.slice(0, 6)}...</p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Position (X, Y, Z)</label>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {[0, 1, 2].map(axis => (
                                                                    <input
                                                                        key={axis}
                                                                        type="number"
                                                                        step="0.1"
                                                                        value={selectedItem.position[axis]}
                                                                        onChange={(e) => {
                                                                            const newPos = [...selectedItem.position] as [number, number, number];
                                                                            newPos[axis] = Number(e.target.value);
                                                                            handleUpdateItem({ ...selectedItem, position: newPos });
                                                                        }}
                                                                        className="w-full px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded border border-transparent focus:border-primary-500 outline-none text-gray-900 dark:text-white"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Color</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {['#334155', '#475569', '#854d0e', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6'].map(color => (
                                                                    <button
                                                                        key={color}
                                                                        onClick={() => handleUpdateItem({ ...selectedItem, color })}
                                                                        className={`w-6 h-6 rounded-full border-2 ${selectedItem.color === color ? 'border-primary-500' : 'border-transparent'}`}
                                                                        style={{ backgroundColor: color }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                                            <button
                                                                onClick={() => handleUpdateItem({ ...selectedItem, locked: !selectedItem.locked })}
                                                                className={`w-full py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-medium ${selectedItem.locked ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
                                                            >
                                                                {selectedItem.locked ? <Lock size={16} /> : <Unlock size={16} />}
                                                                {selectedItem.locked ? 'Unlock Object' : 'Lock Object'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : selectionType === 'wall' && selectedItemId ? (
                                                    <div className="space-y-4">
                                                        <h3 className="font-bold text-gray-900 dark:text-white capitalize">{selectedItemId} Wall</h3>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Paint Color</label>
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {['#f3f4f6', '#ffffff', '#e2e8f0', '#cbd5e1', '#94a3b8', '#bfdbfe', '#bbf7d0', '#fecaca', '#ddd6fe'].map(color => (
                                                                    <button
                                                                        key={color}
                                                                        onClick={() => setWallConfig({ ...wallConfig, [selectedItemId]: color })}
                                                                        className={`w-8 h-8 rounded-full border shadow-sm ${wallConfig[selectedItemId] === color ? 'ring-2 ring-primary-500' : ''}`}
                                                                        style={{ backgroundColor: color }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-gray-400 py-8">
                                                        <MousePointer2 size={32} className="mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">Select an object or wall to view properties</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* TOGGLE SIDEBAR */}
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-500" style={{ display: isSidebarOpen ? 'none' : 'block' }}>
                            <PanelLeft size={18} />
                        </button>

                        {/* 3D CANVAS */}
                        <div className="flex-1 bg-gray-950 relative overflow-hidden h-full">
                            <ThreeRoomBuilder
                                width={roomDims.unit === 'ft' ? roomDims.width * 0.3048 : roomDims.width}
                                length={roomDims.unit === 'ft' ? roomDims.length * 0.3048 : roomDims.length}
                                height={roomDims.unit === 'ft' ? roomDims.height * 0.3048 : roomDims.height}
                                wallConfig={wallConfig}
                                floorType={floorType}
                                items={furnitureItems}
                                onItemsChange={setFurnitureItems}
                                selectedId={selectedItemId}
                                onSelect={handleSelect}
                                transformMode={transformMode}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* LOGIN MODAL (Existing logic preserved) */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
                        <Crown className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2 dark:text-white">Login Required</h3>
                        <p className="text-gray-500 mb-6">Please sign in to continue.</p>
                        <button onClick={() => navigate('/login')} className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold">Log In</button>
                        <button onClick={() => setShowLoginModal(false)} className="mt-3 text-sm text-gray-500 hover:text-gray-900">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
