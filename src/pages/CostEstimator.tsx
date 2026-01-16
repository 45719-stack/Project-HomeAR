import { useState } from 'react';
import DesignForm, { type DesignData } from '../components/DesignForm';
import { calculateCost, type CostResult } from '../utils/costLogic';
import { Calculator } from 'lucide-react';

export default function CostEstimator() {
    const [result, setResult] = useState<CostResult | null>(null);

    const handleCalculate = (data: DesignData) => {
        const costData = calculateCost(data.city, data.length, data.width);
        setResult(costData);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Renovation Cost Estimator</h1>
                <p className="mt-4 text-lg text-gray-500">Calculate estimated material and labor costs for your room based on city rates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Details</h2>
                    <DesignForm onSubmit={handleCalculate} submitLabel="Calculate Cost" />
                </div>

                <div>
                    {result ? (
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 bg-primary-50 border-b border-primary-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-primary-800">Estimation Result</h3>
                                <div className="p-2 bg-white rounded-full text-primary-600">
                                    <Calculator size={20} />
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-6 text-center">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">Total Estimated Cost</p>
                                    <p className="text-4xl font-extrabold text-gray-900 mt-2">
                                        PKR {result.totalCost.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        (~PKR {result.pricePerSqFt.toFixed(0)} / sqft)
                                    </p>
                                </div>

                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="py-3 text-sm font-medium text-gray-500">City</td>
                                            <td className="py-3 text-sm text-gray-900 text-right">{result.city}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-sm font-medium text-gray-500">Area</td>
                                            <td className="py-3 text-sm text-gray-900 text-right">{result.area} sqft</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-sm font-medium text-gray-500">Paint Cost (Rate: {result.paintRate})</td>
                                            <td className="py-3 text-sm text-gray-900 text-right">PKR {result.materialCost.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-sm font-medium text-gray-500">Labor Cost (Rate: {result.laborRate})</td>
                                            <td className="py-3 text-sm text-gray-900 text-right">PKR {result.laborCost.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="mt-6 text-xs text-gray-400 text-center">
                                    *Estimates are approximate based on standard market rates. Actual vendor quotes may vary.
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center h-full flex flex-col justify-center items-center text-gray-400">
                            <Calculator size={48} className="mb-4 text-gray-300" />
                            <p>Enter details to estimate costs.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
