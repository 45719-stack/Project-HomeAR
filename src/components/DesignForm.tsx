import { useState } from 'react';

export interface DesignData {
    city: string;
    roomType: string;
    length: number;
    width: number;
    style: string;
}

interface DesignFormProps {
    onSubmit: (data: DesignData) => void;
    submitLabel?: string;
    className?: string;
}

export default function DesignForm({ onSubmit, submitLabel = "Submit", className = "" }: DesignFormProps) {
    const [formData, setFormData] = useState<DesignData>({
        city: 'Karachi',
        roomType: 'Bedroom',
        length: 10,
        width: 10,
        style: 'Modern',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'length' || name === 'width' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                    >
                        <option value="Karachi">Karachi</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Multan">Multan</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">Room Type</label>
                    <select
                        id="roomType"
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                    >
                        <option value="Bedroom">Bedroom</option>
                        <option value="Lounge">Lounge</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Office">Office</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length (ft)</label>
                        <input
                            type="number"
                            name="length"
                            id="length"
                            min="1"
                            value={formData.length}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-3 py-2 border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                        />
                    </div>
                    <div>
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width (ft)</label>
                        <input
                            type="number"
                            name="width"
                            id="width"
                            min="1"
                            value={formData.width}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-3 py-2 border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="style" className="block text-sm font-medium text-gray-700">Style</label>
                    <select
                        id="style"
                        name="style"
                        value={formData.style}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                    >
                        <option value="Modern">Modern</option>
                        <option value="Minimalist">Minimalist</option>
                        <option value="Traditional">Traditional</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
