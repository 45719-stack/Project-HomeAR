import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
    return (
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white py-2 px-4 relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-sm sm:text-base">
                <div className="flex-1 flex justify-center sm:justify-start items-center gap-2">
                    <span className="font-medium">Launch Offer: Try AI Room Redesign for Free</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2 hidden sm:inline-block">Limited Time</span>
                </div>
                <Link
                    to="/design"
                    className="hidden sm:inline-block bg-white text-primary-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
                >
                    Get It Now
                </Link>
            </div>
        </div>
    );
}
