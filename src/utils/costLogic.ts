export interface CostResult {
    city: string;
    area: number;
    paintRate: number;
    laborRate: number;
    materialCost: number;
    laborCost: number;
    totalCost: number;
    pricePerSqFt: number;
}

const RATES: Record<string, { paint: number; labor: number }> = {
    Karachi: { paint: 80, labor: 120 },
    Lahore: { paint: 70, labor: 110 },
    Islamabad: { paint: 90, labor: 140 },
    Multan: { paint: 65, labor: 100 },
};

export function calculateCost(city: string, length: number, width: number): CostResult {
    const cityRates = RATES[city] || RATES['Karachi']; // Default to Karachi if not found
    const area = length * width;
    const materialCost = cityRates.paint * area;
    const laborCost = cityRates.labor * area;
    const totalCost = materialCost + laborCost;
    const pricePerSqFt = area > 0 ? totalCost / area : 0;

    return {
        city,
        area,
        paintRate: cityRates.paint,
        laborRate: cityRates.labor,
        materialCost,
        laborCost,
        totalCost,
        pricePerSqFt,
    };
}
