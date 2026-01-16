import HeroSection from '../components/landing/HeroSection';
import SocialProof from '../components/landing/SocialProof';
import RedesignSection from '../components/landing/RedesignSection';
import FeaturesSection from '../components/landing/FeaturesSection';

export default function Landing() {
    return (
        <div className="bg-white dark:bg-slate-950 transition-colors">
            <HeroSection />
            <SocialProof />
            <RedesignSection id="redesign" />
            <FeaturesSection id="templates" />
        </div>
    );
}
