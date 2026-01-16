import { useState } from 'react';
import DesignForm, { type DesignData } from '../components/DesignForm';
import { Cuboid, MapPin, Palette } from 'lucide-react';

export default function RoomDesign() {
    const [design, setDesign] = useState<DesignData | null>(null);

    const handleDesignSubmit = (data: DesignData) => {
        setDesign(data);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Design Your Room</h1>
                <p className="mt-4 text-lg text-gray-500">Enter your room details to generate a preview.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Form */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Details</h2>
                    <DesignForm onSubmit={handleDesignSubmit} submitLabel="Generate Preview" />
                </div>

                {/* Right Column: Preview */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
                    {design ? (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="h-48 bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
                                <span className="text-gray-400 font-medium flex items-center gap-2">
                                    {/* Placeholder for 3D/AR View */}
                                    <Cuboid size={48} className="text-primary-300" />
                                    AR View Loading...
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={18} />
                                    <span>{design.city}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Palette size={18} />
                                    <span>{design.style} {design.roomType}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="font-mono text-sm border p-1 rounded bg-gray-50">
                                        {design.length}' x {design.width}' ({design.length * design.width} sqft)
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2">Estimated Cost</p>
                                    <p className="text-xl font-bold text-gray-400">Coming Soon</p>
                                </div>

                                <button disabled className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed">
                                    AR Preview – Coming Soon
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center h-full flex flex-col justify-center items-center text-gray-400">
                            <Cuboid size={48} className="mb-4 text-gray-300" />
                            <p>Submit the form to see your design preview.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
