import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DEMO_ATHLETES } from '../utils/dataShapes';
import ScoutDashboard from '../components/scout/ScoutDashboard';

export default function ScoutView() {
  const [athletes, setAthletes] = useState([]);
  const [filters, setFilters] = useState({
    sport: '',
    ageGroup: '',
    gender: '',
    district: '',
    minRating: 1000,
    minMentalScore: 0,
    verifiedOnly: false,
    sortBy: 'rating_desc',
  });

  // Load athlete data from localStorage + demo data
  useEffect(() => {
    let localAthletes = [];
    try {
      const saved = localStorage.getItem('sentrak_athletes');
      if (saved) {
        localAthletes = JSON.parse(saved);
      }
    } catch { /* ignore */ }

    // Merge: demo athletes + local athletes (local overwrites by id)
    const merged = [...DEMO_ATHLETES];
    localAthletes.forEach(la => {
      const existingIdx = merged.findIndex(m => m.id === la.id);
      if (existingIdx >= 0) {
        merged[existingIdx] = la;
      } else {
        merged.push(la);
      }
    });

    setAthletes(merged);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <Search size={28} color="var(--accent-warning)" />
          Scout Command Center
        </h1>
        <p className="page-subtitle">Search, discover, and recruit grassroots talent across Tamil Nadu</p>
      </div>

      <ScoutDashboard
        athletes={athletes}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}
