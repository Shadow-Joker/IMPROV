import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllAthletes } from '../utils/demoLoader';
import ScoutDashboard from '../components/scout/ScoutDashboard';
import { getCloudAthletes } from '../services/firestoreService';

export default function ScoutView() {
  const [athletes, setAthletes] = useState([]);
  const [filters, setFilters] = useState({
    sport: '', sports: [], ageGroup: '', gender: '', district: '',
    minRating: 1000, minMentalScore: 0, verifiedOnly: false, sortBy: 'rating_desc',
  });

  useEffect(() => {
    async function loadData() {
      const demoAthletes = getAllAthletes();
      if (navigator.onLine) {
        try {
          const cloudAthletes = await getCloudAthletes();
          // Filter out duplicates (demo athletes already have stable IDs)
          const cloudOnly = cloudAthletes.filter(ca => !demoAthletes.find(da => da.id === ca.id));
          setAthletes([...demoAthletes, ...cloudOnly]);
        } catch (e) {
          console.error('[ScoutView] Cloud load failed:', e);
          setAthletes(demoAthletes);
        }
      } else {
        setAthletes(demoAthletes);
      }
    }
    loadData();
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
