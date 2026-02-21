import { useState, useMemo } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { SPORTS, AGE_GROUPS } from '../../utils/dataShapes';
import { searchDistricts, getAllDistricts } from '../../utils/districts';

export default function SearchFilters({ filters, onChange }) {
    const [distQuery, setDistQuery] = useState('');
    const [distOpen, setDistOpen] = useState(false);
    const [collapsed, setCollapse] = useState(false);

    const update = (key, value) => onChange({ ...filters, [key]: value });

    const filteredDists = useMemo(() =>
        distQuery.length > 0 ? searchDistricts(distQuery) : getAllDistricts(),
        [distQuery]
    );

    const toggleSport = (sport) => {
        const current = filters.sports || [];
        const next = current.includes(sport) ? current.filter(s => s !== sport) : [...current, sport];
        update('sports', next);
    };

    const clearAll = () => {
        onChange({
            sport: '', sports: [], ageGroup: '', gender: '', district: '',
            minRating: 1000, minMentalScore: 0, verifiedOnly: false, sortBy: 'rating_desc',
        });
    };

    const activeSports = filters.sports || (filters.sport ? [filters.sport] : []);

    return (
        <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-md)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-md">
                <h3 className="flex items-center gap-xs" style={{ fontSize: '1rem', fontWeight: 700 }}>
                    <Filter size={17} color="var(--accent-primary)" /> Filters
                </h3>
                <div className="flex items-center gap-xs">
                    <button className="btn btn-ghost" onClick={clearAll}
                        style={{ padding: '2px 8px', minHeight: 'auto', fontSize: '0.7rem' }}>
                        <X size={12} /> Clear
                    </button>
                    <button className="btn btn-ghost" onClick={() => setCollapse(!collapsed)}
                        style={{ padding: '2px 6px', minHeight: 'auto' }}>
                        <ChevronDown size={14} style={{ transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                </div>
            </div>

            {!collapsed && (
                <div className="flex-col" style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    {/* ── Sport Pills ── */}
                    <div>
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>SPORT</label>
                        <div className="flex" style={{ flexWrap: 'wrap', gap: 6 }}>
                            {SPORTS.map(s => {
                                const active = activeSports.includes(s);
                                return (
                                    <button key={s} onClick={() => toggleSport(s)}
                                        style={{
                                            padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
                                            borderRadius: 'var(--radius-full)', border: '1px solid',
                                            borderColor: active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                            background: active ? 'var(--accent-primary)' : 'transparent',
                                            color: active ? 'white' : 'var(--text-secondary)',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            whiteSpace: 'nowrap',
                                        }}>
                                        {s.replace(/_/g, ' ')}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Age Group ── */}
                    <div>
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>AGE GROUP</label>
                        <div className="flex" style={{ gap: 4, flexWrap: 'wrap' }}>
                            <button onClick={() => update('ageGroup', '')}
                                style={{
                                    padding: '5px 10px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 'var(--radius-sm)',
                                    border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                                    borderColor: !filters.ageGroup ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    background: !filters.ageGroup ? 'var(--accent-primary)' : 'transparent',
                                    color: !filters.ageGroup ? 'white' : 'var(--text-secondary)',
                                }}>All</button>
                            {AGE_GROUPS.map(ag => (
                                <button key={ag} onClick={() => update('ageGroup', ag)}
                                    style={{
                                        padding: '5px 10px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 'var(--radius-sm)',
                                        border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                                        borderColor: filters.ageGroup === ag ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                        background: filters.ageGroup === ag ? 'var(--accent-primary)' : 'transparent',
                                        color: filters.ageGroup === ag ? 'white' : 'var(--text-secondary)',
                                    }}>{ag}</button>
                            ))}
                        </div>
                    </div>

                    {/* ── Gender ── */}
                    <div>
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>GENDER</label>
                        <div className="flex" style={{ gap: 4 }}>
                            {['', 'male', 'female'].map(g => (
                                <button key={g} onClick={() => update('gender', g)}
                                    style={{
                                        padding: '5px 12px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 'var(--radius-sm)',
                                        border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', flex: 1,
                                        borderColor: filters.gender === g ? 'var(--accent-success)' : 'rgba(255,255,255,0.1)',
                                        background: filters.gender === g ? 'rgba(34,197,94,0.15)' : 'transparent',
                                        color: filters.gender === g ? 'var(--accent-success)' : 'var(--text-secondary)',
                                    }}>{g === '' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}</button>
                            ))}
                        </div>
                    </div>

                    {/* ── District Search ── */}
                    <div style={{ position: 'relative' }}>
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>DISTRICT</label>
                        <input className="form-input" type="text" placeholder="Search districts..."
                            value={distQuery} onChange={e => { setDistQuery(e.target.value); setDistOpen(true); }}
                            onFocus={() => setDistOpen(true)}
                            style={{ fontSize: '0.8rem', padding: '8px 10px' }} />
                        {filters.district && (
                            <div className="flex items-center gap-xs mt-xs">
                                <span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>{filters.district}</span>
                                <button onClick={() => { update('district', ''); setDistQuery(''); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        {distOpen && distQuery.length > 0 && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                                background: 'rgba(15,20,50,0.95)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-sm)',
                                maxHeight: 180, overflowY: 'auto', marginTop: 4,
                            }}>
                                {filteredDists.slice(0, 10).map(d => (
                                    <div key={d.id} onClick={() => { update('district', d.name); setDistQuery(''); setDistOpen(false); }}
                                        style={{
                                            padding: '8px 12px', cursor: 'pointer', fontSize: '0.8rem',
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        {d.name} <span className="tamil text-muted" style={{ fontSize: '0.7rem', marginLeft: 4 }}>{d.nameTamil}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Min Rating ── */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="form-label" style={{ fontSize: '0.72rem', marginBottom: 0 }}>MIN RATING</label>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                {filters.minRating || 1000}
                            </span>
                        </div>
                        <input type="range" min="1000" max="2500" step="50" value={filters.minRating || 1000}
                            onChange={e => update('minRating', parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-primary)', marginTop: 4 }} />
                        <div className="flex justify-between" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                            <span>1000</span><span>2500</span>
                        </div>
                    </div>

                    {/* ── Verified Toggle (iOS-style) ── */}
                    <div className="flex items-center justify-between">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Verified Only</label>
                        <div onClick={() => update('verifiedOnly', !filters.verifiedOnly)}
                            style={{
                                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                                background: filters.verifiedOnly ? 'var(--accent-success)' : 'rgba(255,255,255,0.12)',
                                transition: 'background 0.25s', position: 'relative', flexShrink: 0,
                            }}>
                            <div style={{
                                width: 20, height: 20, borderRadius: '50%', background: 'white',
                                position: 'absolute', top: 2,
                                left: filters.verifiedOnly ? 22 : 2,
                                transition: 'left 0.25s cubic-bezier(.4,0,.2,1)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            }} />
                        </div>
                    </div>

                    {/* ── Sort ── */}
                    <div>
                        <label className="form-label" style={{ fontSize: '0.72rem' }}>SORT BY</label>
                        <select className="form-select" value={filters.sortBy || 'rating_desc'}
                            onChange={e => update('sortBy', e.target.value)}
                            style={{ fontSize: '0.8rem', padding: '8px 10px' }}>
                            <option value="rating_desc">Rating ↓</option>
                            <option value="rating_asc">Rating ↑</option>
                            <option value="mental_desc">Mental Score ↓</option>
                            <option value="name_asc">Name A-Z</option>
                            <option value="recent">Most Recent</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
