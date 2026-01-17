import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Crown, Check, ChevronDown, User, Grid, LogOut, AlertTriangle, Settings } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    // Derived state
    const userPlan = user?.plan || 'free';
    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || '';

    const [isPlanMenuOpen, setIsPlanMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Close dropdowns on route change
    useEffect(() => {
        setIsProfileMenuOpen(false);
        setIsPlanMenuOpen(false);
        setIsOpen(false);
    }, [location.pathname]);

    const handleUpgradeClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            navigate('/login?redirect=/upgrade');
        } else {
            navigate('/upgrade');
        }
        setIsOpen(false);
    };

    const handleDowngrade = () => {
        // In a real app, this would be an API call to Firestore
        // For now, we can only update local state if we had a setPlan method, 
        // but since we read from Firestore, this might be tricky without a backend function.
        // We'll just show an alert or console log for now as "Not Implemented" fully without backend logic,
        // or we can try to update the Firestore doc if we allowed client-side writes (which we usually don't for plans).
        // Assuming we just want the UI interaction for now:
        alert("Plan downgrade would happen here. (Requires Firestore write permissions or Cloud Function)");
        setShowDowngradeConfirm(false);
        setIsPlanMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setIsProfileMenuOpen(false);
        setIsOpen(false);
        navigate('/');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };



    return (
        <>
            {/* Downgrade Confirmation Modal */}
            {showDowngradeConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-800 animate-in zoom-in-95">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Downgrade to Free?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                You will lose access to Ultra benefits including verified filters and direct contact info.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowDowngradeConfirm(false)}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Keep Ultra
                            </button>
                            <button
                                onClick={handleDowngrade}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Yes, Downgrade
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                                <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white transition-transform duration-300 group-hover:scale-105">
                                    Home<span className="text-primary-600 dark:text-primary-400">AR</span>
                                </span>
                            </Link>
                        </div>

                        <div className="hidden md:ml-8 md:flex md:space-x-6 items-center">
                            <NavItem to="/">Home</NavItem>
                            <NavItem to="/redesign">Start Now</NavItem>
                            <NavItem to="/features">Features</NavItem>
                            <NavItem to="/vendors">Vendors</NavItem>

                            {!user && (
                                <NavItem to="/login">Login</NavItem>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            {userPlan === 'free' ? (
                                <button
                                    onClick={handleUpgradeClick}
                                    className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-px active:scale-95 flex items-center gap-2"
                                >
                                    <Crown size={16} /> Upgrade to Premium
                                </button>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsPlanMenuOpen(!isPlanMenuOpen)}
                                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-200 dark:border-green-800 flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                    >
                                        <Check size={16} />
                                        {userPlan === 'ultra' ? 'Ultra Active' : 'Premium Active'}
                                        <ChevronDown size={14} className={`transition-transform ${isPlanMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Plan Dropdown */}
                                    {isPlanMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsPlanMenuOpen(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 py-1 animate-in fade-in slide-in-from-top-2">
                                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Current Plan</p>
                                                    <p className="font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                                                        {userPlan}
                                                        {userPlan === 'ultra' && <Crown size={14} className="text-purple-500" />}
                                                    </p>
                                                </div>
                                                <Link
                                                    to="/upgrade"
                                                    onClick={() => setIsPlanMenuOpen(false)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                                                >
                                                    <Settings size={16} /> Switch Plan
                                                </Link>
                                                <button
                                                    disabled
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed flex items-center gap-2"
                                                >
                                                    Billing & Payments
                                                </button>
                                                <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>
                                                <button
                                                    onClick={() => { setIsPlanMenuOpen(false); setShowDowngradeConfirm(true); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                                                >
                                                    <LogOut size={16} /> Cancel / Downgrade
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* User Profile Dropdown */}
                            {user && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                        title={userName}
                                    >
                                        <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-800 shadow-sm hover:scale-105 transition-transform">
                                            {getInitials(userName)}
                                        </div>
                                    </button>

                                    {isProfileMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 py-1 animate-in fade-in slide-in-from-top-2">
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                    <p className="font-bold text-gray-900 dark:text-white truncate">{userName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                                </div>

                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                                    <User size={16} /> My Profile
                                                </button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                                    <Grid size={16} /> My Designs
                                                </button>

                                                <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                                                >
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                        </div>

                        <div className="flex items-center md:hidden gap-4">
                            {/* Mobile User Profile (simplified) */}
                            {user && (
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-xs">
                                    {getInitials(userName)}
                                </div>
                            )}


                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        <div className="pt-2 pb-3 space-y-1 px-4">
                            <NavLink to="/" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Home</NavLink>
                            <NavLink to="/redesign" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Start Now</NavLink>
                            <NavLink to="/features" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Features</NavLink>
                            <NavLink to="/vendors" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Vendors</NavLink>

                            {!user && (
                                <NavLink to="/login" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Login</NavLink>
                            )}

                            {user && (
                                <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                                    <div className="px-3 py-2 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-sm">
                                            {getInitials(userName)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                                            <p className="text-xs text-gray-500">{userEmail}</p>
                                        </div>
                                    </div>
                                    <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">My Profile</button>
                                    <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">My Designs</button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}

                            <div className="pt-2">
                                {userPlan === 'free' ? (
                                    <button
                                        onClick={handleUpgradeClick}
                                        className="w-full text-center bg-primary-600 text-white px-5 py-3 rounded-lg text-base font-semibold shadow-md active:bg-primary-700 dark:bg-primary-500 dark:active:bg-primary-600"
                                    >
                                        Upgrade to Premium
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="w-full text-center bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-5 py-3 rounded-lg text-base font-bold border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                                            <Check size={18} /> {userPlan === 'ultra' ? 'Ultra Active' : 'Premium Active'}
                                        </div>
                                        <button
                                            onClick={() => { setShowDowngradeConfirm(true); setIsOpen(false); }}
                                            className="w-full text-center text-sm text-red-600 font-semibold py-2"
                                        >
                                            Downgrade Plan
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

// NavItem Component for Desktop
function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
    const baseClasses = "relative group px-1 py-2 text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"; // Reusable base
    const activeClasses = "text-primary-600 dark:text-primary-400"; // Reusable active
    const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"; // Reusable inactive + hover color
    const animationClasses = "hover:-translate-y-px"; // Reusable animation (1px lift)

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
                ${baseClasses}
                ${isActive ? activeClasses : inactiveClasses}
                ${animationClasses}
            `}
        >
            {({ isActive }) => (
                <>
                    <span className="relative z-10">{children}</span>
                    {/* Glow Effect - Slightly stronger */}
                    <span className="absolute inset-0 bg-primary-400/0 group-hover:bg-primary-400/10 rounded-md blur-sm transition-colors duration-300"></span>
                    {/* Underline Animation */}
                    <span className={`
                        absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full
                        origin-left transition-transform duration-300 ease-out
                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `}></span>
                </>
            )}
        </NavLink>
    );
}
