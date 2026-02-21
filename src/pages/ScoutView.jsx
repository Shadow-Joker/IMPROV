import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllAthletes } from '../utils/demoLoader';
import ScoutDashboard from '../components/scout/ScoutDashboard';

export default function ScoutView() {
  const [athletes, setAthletes] = useState([]);
  const [filters, setFilters] = useState({
    sport: '', sports: [], ageGroup: '', gender: '', district: '',
    minRating: 1000, minMentalScore: 0, verifiedOnly: false, sortBy: 'rating_desc',
  });

  useEffect(() => {
    setAthletes(getAllAthletes());
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
      <ScoutDashboard athletes={athletes} filters={filters} onFilterChange={setFilters} />
    </div>
  );
}
