import { useState } from 'react';
import { Search, Map, Trophy, Radio, Briefcase } from 'lucide-react';
import SearchFilters from './SearchFilters';
import AthleteRanking from './AthleteRanking';
import TalentHeatMap from './TalentHeatMap';
import DiscoveryFeed from './DiscoveryFeed';
import RecruitmentPortal from './RecruitmentPortal';

const TABS = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'heatmap', label: 'Heat Map', icon: Map },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'feed', label: 'Feed', icon: Radio },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
];

export default function ScoutDashboard({ athletes, filters, onFilterChange }) {
    const [activeTab, setActiveTab] = useState('search');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'search':
                return <AthleteRanking athletes={athletes} filters={filters} />;
            case 'heatmap':
                return <TalentHeatMap athletes={athletes} />;
            case 'rankings':
                return <AthleteRanking athletes={athletes} filters={filters} />;
            case 'feed':
                return <DiscoveryFeed />;
            case 'recruitment':
                return <RecruitmentPortal athletes={athletes} />;
            default:
                return null;
        }
    };

    const showSidebar = activeTab === 'search' || activeTab === 'rankings';

    return (
        <div className="animate-fade-in">
            {/* Tabs */}
            <div className="tabs">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="flex items-center gap-xs">
                                <Icon size={16} />
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Layout: Sidebar + Main on desktop */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: showSidebar ? '280px 1fr' : '1fr',
                gap: 'var(--space-md)',
            }}>
                {/* Sidebar Filters (only for search/rankings tabs) */}
                {showSidebar && (
                    <aside style={{
                        position: 'sticky',
                        top: 80,
                        alignSelf: 'start',
                        maxHeight: 'calc(100vh - 100px)',
                        overflowY: 'auto',
                    }}>
                        <SearchFilters filters={filters} onChange={onFilterChange} />
                    </aside>
                )}

                {/* Main Content */}
                <main style={{ minWidth: 0 }}>
                    {renderTabContent()}
                </main>
            </div>

            {/* Responsive: stacked layout on tablet/mobile */}
            <style>{`
        @media (max-width: 1024px) {
          .scout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
