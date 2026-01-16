import { X, Phone, MessageCircle, Mail, Clock, Check, Star, MapPin, Tag } from 'lucide-react';
import type { Vendor } from '../data/vendors';

interface VendorDetailsModalProps {
    vendor: Vendor;
    isOpen: boolean;
    userPlan: 'free' | 'premium' | 'ultra';
    onClose: () => void;
    onContactUpgrade: () => void;
}

export default function VendorDetailsModal({ vendor, isOpen, userPlan, onClose, onContactUpgrade }: VendorDetailsModalProps) {
    if (!isOpen) return null;

    const isContactLocked = userPlan === 'free';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    {/* Header Image Pattern */}
                    <div className="h-32 bg-gradient-to-r from-primary-600 to-indigo-600"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>

                    <div className="px-8 -mt-12 mb-6">
                        <div className="flex justify-between items-end">
                            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-4 border-white dark:border-gray-900 flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {vendor.name.charAt(0)}
                            </div>
                            <div className="flex flex-col items-end gap-2 mb-2">
                                {vendor.verified && (
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <Check size={14} strokeWidth={3} /> Verified
                                    </span>
                                )}
                                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                    <Star size={18} fill="currentColor" /> {vendor.rating} <span className="text-gray-400 dark:text-gray-500 text-sm font-normal">({vendor.reviewsCount} reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{vendor.name}</h2>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1"><MapPin size={16} /> {vendor.city}</span>
                                <span className="flex items-center gap-1"><Tag size={16} /> {vendor.category}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{vendor.description}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Services</h3>
                            <div className="flex flex-wrap gap-2">
                                {vendor.services.map((service, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Availability</span>
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                                    <Clock size={18} className="text-primary-500" /> {vendor.availability}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Response Time</span>
                                <div className="text-gray-900 dark:text-white font-medium">
                                    {vendor.responseTime}
                                </div>
                            </div>
                        </div>

                        {/* Contact Section - Gated */}
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>

                            {isContactLocked ? (
                                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-6 overflow-hidden text-center">
                                    <div className="absolute inset-0 backdrop-blur-sm bg-white/40 dark:bg-black/40 z-10 flex flex-col items-center justify-center p-6">
                                        <div className="bg-white dark:bg-gray-900 p-3 rounded-full shadow-lg mb-3">
                                            <Phone className="text-primary-500" size={24} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Contact Info Locked</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
                                            Upgrade your plan to view direct contact numbers and email addresses for vetted vendors.
                                        </p>
                                        <button
                                            onClick={onContactUpgrade}
                                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                                        >
                                            Upgrade to Unlock
                                        </button>
                                    </div>
                                    {/* Blurred Fake content behind */}
                                    <div className="flex flex-col gap-3 opacity-30 filter blur-sm">
                                        <div className="flex items-center gap-3"><Phone size={20} /> +92 300 0000000</div>
                                        <div className="flex items-center gap-3"><MessageCircle size={20} /> +92 300 0000000</div>
                                        <div className="flex items-center gap-3"><Mail size={20} /> contact@vendor.com</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <a href={`tel:${vendor.phone}`} className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                                        <Phone className="mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-semibold">Call Now</span>
                                        <span className="text-xs opacity-75">{vendor.phone}</span>
                                    </a>
                                    <a href={`https://wa.me/${vendor.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
                                        <MessageCircle className="mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-semibold">WhatsApp</span>
                                        <span className="text-xs opacity-75">Chat</span>
                                    </a>
                                    <a href={`mailto:${vendor.email}`} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                                        <Mail className="mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-semibold">Email</span>
                                        <span className="text-xs opacity-75">Send Inquiry</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
