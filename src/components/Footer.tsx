export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-6">
                    <a href="#" className="text-gray-400 hover:text-gray-500">About</a>
                    <span className="text-gray-300">|</span>
                    <a href="#" className="text-gray-400 hover:text-gray-500">Contact</a>
                    <span className="text-gray-300">|</span>
                    <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} HomeAR Pakistan. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
