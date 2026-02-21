import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Shield, ChevronUp, ChevronDown, CheckCircle, XCircle, User } from 'lucide-react';
import { getRatingTier, getAgeGroup } from '../../utils/dataShapes';

export default function AthleteRanking({ athletes, filters }) {
    const navigate = useNavigate();
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState('desc');

    // Apply filters
    let filtered = [...(athletes || [])];

    if (filters?.sport) {
        filtered = filtered.filter(a => a.sport === filters.sport);
    }
    if (filters?.ageGroup) {
        filtered = filtered.filter(a => getAgeGroup(a.age) === filters.ageGroup);
    }
    if (filters?.gender) {
        filtered = filtered.filter(a => a.gender === filters.gender);
    }
    if (filters?.district) {
        filtered = filtered.filter(a => a.district?.toLowerCase() === filters.district?.toLowerCase() ||
            a.district?.toLowerCase().replace(/\s/g, '') === filters.district?.toLowerCase().replace(/\s/g, ''));
    }
    if (filters?.minRating && filters.minRating > 1000) {
        filtered = filtered.filter(a => a.talentRating >= filters.minRating);
    }
    if (filters?.minMentalScore && filters.minMentalScore > 0) {
        filtered = filtered.filter(a => a.mentalScore >= filters.minMentalScore);
    }
    if (filters?.verifiedOnly) {
        filtered = filtered.filter(a => a.syncStatus === 'synced');
    }

    // Apply sort
    const activeSortBy = sortCol || filters?.sortBy || 'rating_desc';
    filtered.sort((a, b) => {
        switch (activeSortBy) {
            case 'rating_desc': return b.talentRating - a.talentRating;
            case 'mental_desc': return b.mentalScore - a.mentalScore;
            case 'recent': return b.createdAt - a.createdAt;
            case 'name_asc': return a.name.localeCompare(b.name);
            default: return b.talentRating - a.talentRating;
        }
    });
    if (sortCol && sortDir === 'asc') filtered.reverse();

    const handleSort = (col) => {
        if (sortCol === col) {
            setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        } else {
            setSortCol(col);
            setSortDir('desc');
        }
    };

    const SortIcon = ({ col }) => {
        if (sortCol !== col) return <ChevronDown size={12} style={{ opacity: 0.3 }} />;
        return sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />;
    };

    const getRankStyle = (rank) => {
        if (rank === 1) return { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1a1a', fontWeight: 800 };
        if (rank === 2) return { background: 'linear-gradient(135deg, #9ca3af, #d1d5db)', color: '#1a1a1a', fontWeight: 700 };
        if (rank === 3) return { background: 'linear-gradient(135deg, #b45309, #d97706)', color: 'white', fontWeight: 700 };
        return {};
    };

    if (filtered.length === 0) {
        return (
            <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
                <Trophy size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-md)' }} />
                <p className="text-secondary">No athletes match your filters</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-md">
                <h3 className="heading-4 flex items-center gap-sm">
                    <Trophy size={20} color="var(--accent-gold)" />
                    Talent Rankings
                </h3>
                <span className="badge badge-verified">{filtered.length} athletes</span>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: 50 }}>#</th>
                            <th style={{ width: 40 }}></th>
                            <th onClick={() => handleSort('name_asc')} style={{ cursor: 'pointer' }}>
                                <span className="flex items-center gap-xs">Name <SortIcon col="name_asc" /></span>
                            </th>
                            <th>Age</th>
                            <th>Sport</th>
                            <th>District</th>
                            <th onClick={() => handleSort('rating_desc')} style={{ cursor: 'pointer' }}>
                                <span className="flex items-center gap-xs">Rating <SortIcon col="rating_desc" /></span>
                            </th>
                            <th onClick={() => handleSort('mental_desc')} style={{ cursor: 'pointer' }}>
                                <span className="flex items-center gap-xs">Mental <SortIcon col="mental_desc" /></span>
                            </th>
                            <th>Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((athlete, idx) => {
                            const rank = idx + 1;
                            const tier = getRatingTier(athlete.talentRating);
                            const isVerified = athlete.syncStatus === 'synced';
                            return (
                                <tr
                                    key={athlete.id}
                                    onClick={() => navigate(`/profile/${athlete.id}`)}
                                    style={{ cursor: 'pointer', transition: 'var(--transition-fast)' }}
                                >
                                    <td>
                                        <span
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                width: 28, height: 28, borderRadius: 'var(--radius-full)',
                                                fontSize: '0.8rem', ...getRankStyle(rank),
                                            }}
                                        >{rank}</span>
                                    </td>
                                    <td>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 'var(--radius-full)',
                                            background: 'var(--gradient-hero)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
                                        }}>
                                            {athlete.photoURL ? (
                                                <img src={athlete.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', objectFit: 'cover' }} />
                                            ) : (
                                                athlete.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>{athlete.name}</span>
                                            {athlete.nameTamil && (
                                                <span className="tamil text-muted" style={{ display: 'block', fontSize: '0.75rem' }}>{athlete.nameTamil}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span>{athlete.age}</span>
                                        <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>{getAgeGroup(athlete.age)}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem' }}>{athlete.sport?.replace(/_/g, ' ')}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem' }}>{athlete.district}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-xs">
                                            <span className={`badge ${tier.class}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                                                {athlete.talentRating}
                                            </span>
                                            <span className="text-muted" style={{ fontSize: '0.65rem' }}>{tier.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-xs">
                                            <span style={{
                                                fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600,
                                                color: athlete.mentalScore >= 80 ? 'var(--accent-success)' : athlete.mentalScore >= 60 ? 'var(--accent-warning)' : 'var(--text-secondary)',
                                            }}>{athlete.mentalScore}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {isVerified ? (
                                            <CheckCircle size={18} color="var(--accent-success)" />
                                        ) : (
                                            <XCircle size={18} color="var(--text-muted)" />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
