export type Plan = 'free' | 'premium' | 'ultra';

export interface Template {
    id: string;
    name: string;
    image: string;
    tier: Plan;
    filter: string;
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
