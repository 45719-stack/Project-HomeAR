import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Tag, Filter, Check, Star, ChevronDown } from 'lucide-react';
import { VENDOR_DATA } from '../data/vendors';
import type { Vendor } from '../data/vendors';
import VendorDetailsModal from '../components/VendorDetailsModal';
import UpgradeModal from '../components/UpgradeModal';

export default function Vendors() {
    // ---- STATE ----
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortOption, setSortOption] = useState('Recommended');
    const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);

    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const [userPlan, setUserPlan] = useState<'free' | 'premium' | 'ultra'>('free');

    // ---- EFFECTS ----
    useEffect(() => {
        const checkPlan = () => {
            const storedPlan = localStorage.getItem('plan') as 'free' | 'premium' | 'ultra';
            if (storedPlan) setUserPlan(storedPlan);
            else setUserPlan('free');
        };

        checkPlan();
        window.addEventListener('storage', checkPlan);
        window.addEventListener('planChange', checkPlan);
        return () => {
            window.removeEventListener('storage', checkPlan);
            window.removeEventListener('planChange', checkPlan);
        };
    }, []);

    // ---- FILTERING LOGIC ----
    const filteredVendors = useMemo(() => {
        return VENDOR_DATA.filter(vendor => {
            const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vendor.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCity = cityFilter === 'All' || vendor.city === cityFilter;
            const matchesCategory = categoryFilter === 'All' || vendor.category === categoryFilter;
            const matchesVerified = !isVerifiedOnly || vendor.verified;

            return matchesSearch && matchesCity && matchesCategory && matchesVerified;
        }).sort((a, b) => {
            if (sortOption === 'Highest Rated') return b.rating - a.rating;
            if (sortOption === 'Verified First') return (b.verified === a.verified) ? 0 : b.verified ? 1 : -1;
            // Simple price sort approximation (optional, robust parsing needed for real app)
            return 0; // Default Recommended
        });
    }, [searchQuery, cityFilter, categoryFilter, sortOption, isVerifiedOnly]); // userPlan not needed

    const visibleVendors = filteredVendors.slice(0, visibleCount);
    const uniqueCategories = Array.from(new Set(VENDOR_DATA.map(v => v.category)));

    // ---- HANDLERS ----
    const handleLoadMore = () => setVisibleCount(prev => prev + 6);

    const handleUpgrade = (plan: 'premium' | 'ultra') => {
        setUserPlan(plan);
        localStorage.setItem('plan', plan);
        setIsUpgradeModalOpen(false);
        // Dispatch to update Navbar
        window.dispatchEvent(new Event('planChange'));
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20 transition-colors">

            <VendorDetailsModal
                vendor={selectedVendor!}
                isOpen={!!selectedVendor}
                onClose={() => setSelectedVendor(null)}
                userPlan={userPlan}
                onContactUpgrade={() => {
                    setSelectedVendor(null);
                    setIsUpgradeModalOpen(true);
                }}
            />

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgrade={handleUpgrade}
                title="Contact Verified Vendors"
                description="Direct contact information is exclusive to Premium and Ultra members. Upgrade to connect instantly."
            />

            {/* HEADER */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
                    <a href="/upgrade" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-4 transition-colors">
                        ← Back to Pricing
                    </a>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Find Trusted Professionals
                    </h1>
                    <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 text-lg">
                        Connect with top-rated painters, contractors, and designers in your area.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {/* SEARCH & FILTERS BAR */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Search */}
                        <div className="md:col-span-5 relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search vendor name or service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                            />
                        </div>

                        {/* Dropdowns */}
                        <div className="md:col-span-2 relative">
                            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <select
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-gray-900 dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500 font-medium"
                            >
                                <option value="All">All Cities</option>
                                <option value="Karachi">Karachi</option>
                                <option value="Lahore">Lahore</option>
                                <option value="Islamabad">Islamabad</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        <div className="md:col-span-3 relative">
                            <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-gray-900 dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500 font-medium"
                            >
                                <option value="All">All Categories</option>
                                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        <div className="md:col-span-2 relative">
                            <Filter className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-gray-900 dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500 font-medium"
                            >
                                <option value="Recommended">Recommended</option>
                                <option value="Highest Rated">Highest Rated</option>
                                <option value="Verified First">Verified First</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Ultra Filter */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <label className={`flex items-center gap-2 select-none group ${userPlan !== 'ultra' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input
                                type="checkbox"
                                checked={isVerifiedOnly}
                                onChange={(e) => {
                                    if (userPlan === 'ultra') setIsVerifiedOnly(e.target.checked);
                                }}
                                disabled={userPlan !== 'ultra'}
                                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors">
                                Verified Only {userPlan !== 'ultra' && '(Ultra Benefit)'}
                            </span>
                        </label>
                    </div>
                </div>

                {/* VENDORS GRID */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Showing {Math.min(visibleCount, filteredVendors.length)} of {filteredVendors.length} Pros
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleVendors.map((vendor) => (
                            <div key={vendor.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                                            {vendor.name.charAt(0)}
                                        </div>
                                        {vendor.verified && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                <Check size={12} className="mr-1" /> Verified
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                                        {vendor.name}
                                    </h3>

                                    <div className="flex items-center text-yellow-500 mb-4 text-sm font-medium">
                                        <Star size={16} fill="currentColor" className="mr-1" />
                                        {vendor.rating}
                                        <span className="text-gray-400 dark:text-gray-500 ml-1 font-normal">({vendor.reviewsCount})</span>
                                    </div>

                                    <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            {vendor.city}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} className="text-gray-400" />
                                            {vendor.category}
                                        </div>
                                        <div className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                                            {vendor.priceLabel}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedVendor(vendor)}
                                        className="w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (userPlan === 'free') {
                                                setIsUpgradeModalOpen(true);
                                            } else {
                                                setSelectedVendor(vendor);
                                                // In a real app this might auto-scroll to contact section, here details modal opens
                                            }
                                        }}
                                        className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all"
                                    >
                                        Contact
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION / LOAD MORE */}
                    {visibleCount < filteredVendors.length && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all"
                            >
                                Load More Vendors (+6)
                            </button>
                            <p className="mt-4 text-sm text-gray-500">
                                Showing {visibleCount} of {filteredVendors.length} professionals
                            </p>
                        </div>
                    )}

                    {filteredVendors.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 text-gray-400">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No vendors found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setCityFilter('All'); setCategoryFilter('All'); }}
                                className="mt-6 text-primary-600 font-semibold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
