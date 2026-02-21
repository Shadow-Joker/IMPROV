import { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { SPORTS, AGE_GROUPS } from '../../utils/dataShapes';
import { getAllDistricts, searchDistricts } from '../../utils/districts';

export default function SearchFilters({ filters, onChange }) {
    const [districtSearch, setDistrictSearch] = useState('');
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const dropdownRef = useRef(null);

    const filteredDistricts = searchDistricts(districtSearch);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDistrictDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const update = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    const clearAll = () => {
        onChange({
            sport: '',
            ageGroup: '',
            gender: '',
            district: '',
            minRating: 1000,
            minMentalScore: 0,
            verifiedOnly: false,
            sortBy: 'rating_desc',
        });
        setDistrictSearch('');
    };

    const districts = getAllDistricts();

    return (
        <div className="glass-card-static" style={{ padding: 'var(--space-md)' }}>
            <div className="flex items-center justify-between mb-md" style={{ cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
                <h3 className="heading-4 flex items-center gap-sm">
                    <Filter size={18} color="var(--accent-primary)" />
                    Filters
                </h3>
                <div className="flex items-center gap-sm">
                    <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); clearAll(); }} style={{ fontSize: '0.75rem', padding: '4px 8px', minHeight: 'auto' }}>
                        <X size={14} /> Clear
                    </button>
                    <ChevronDown size={18} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'var(--transition-fast)', color: 'var(--text-muted)' }} />
                </div>
            </div>

            {!collapsed && (
                <div className="flex-col gap-sm" style={{ display: 'flex' }}>
                    {/* Sport */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label className="form-label">Sport</label>
                        <select className="form-select" value={filters.sport || ''} onChange={e => update('sport', e.target.value)} style={{ padding: '10px 12px', minHeight: '40px', fontSize: '0.85rem' }}>
                            <option value="">All Sports</option>
                            {SPORTS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>

                    {/* Age Group */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label className="form-label">Age Group</label>
                        <div className="flex flex-wrap gap-xs">
                            <button
                                className={`btn ${!filters.ageGroup ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => update('ageGroup', '')}
                                style={{ padding: '4px 10px', minHeight: '32px', fontSize: '0.75rem' }}
                            >All</button>
                            {AGE_GROUPS.map(ag => (
                                <button
                                    key={ag}
                                    className={`btn ${filters.ageGroup === ag ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => update('ageGroup', ag)}
                                    style={{ padding: '4px 10px', minHeight: '32px', fontSize: '0.75rem' }}
                                >{ag}</button>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label className="form-label">Gender</label>
                        <div className="flex gap-xs">
                            {['', 'male', 'female'].map(g => (
                                <button
                                    key={g}
                                    className={`btn ${filters.gender === g ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => update('gender', g)}
                                    style={{ padding: '4px 12px', minHeight: '32px', fontSize: '0.75rem', flex: 1 }}
                                >{g === '' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}</button>
                            ))}
                        </div>
                    </div>

                    {/* District Searchable Dropdown */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)', position: 'relative' }} ref={dropdownRef}>
                        <label className="form-label">District</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Search districts..."
                                value={districtSearch || (filters.district ? districts.find(d => d.id === filters.district)?.name || '' : '')}
                                onChange={e => { setDistrictSearch(e.target.value); setShowDistrictDropdown(true); }}
                                onFocus={() => setShowDistrictDropdown(true)}
                                style={{ padding: '10px 12px', minHeight: '40px', fontSize: '0.85rem' }}
                            />
                            <Search size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            {filters.district && (
                                <button
                                    onClick={() => { update('district', ''); setDistrictSearch(''); }}
                                    style={{ position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
                                ><X size={14} /></button>
                            )}
                        </div>
                        {showDistrictDropdown && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                                background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 'var(--radius-md)', maxHeight: 200, overflowY: 'auto',
                                boxShadow: 'var(--shadow-lg)', marginTop: 4,
                            }}>
                                <div
                                    onClick={() => { update('district', ''); setDistrictSearch(''); setShowDistrictDropdown(false); }}
                                    style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                >All Districts</div>
                                {filteredDistricts.map(d => (
                                    <div
                                        key={d.id}
                                        onClick={() => { update('district', d.id); setDistrictSearch(d.name); setShowDistrictDropdown(false); }}
                                        style={{
                                            padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem',
                                            background: filters.district === d.id ? 'var(--accent-primary-glow)' : 'transparent',
                                            transition: 'var(--transition-fast)',
                                        }}
                                        onMouseEnter={e => e.target.style.background = 'var(--bg-glass-hover)'}
                                        onMouseLeave={e => e.target.style.background = filters.district === d.id ? 'var(--accent-primary-glow)' : 'transparent'}
                                    >
                                        <span>{d.name}</span>
                                        <span className="tamil" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>{d.nameTamil}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Min Talent Rating Slider */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label className="form-label">Min Rating: <span className="text-accent" style={{ fontFamily: 'var(--font-mono)' }}>{filters.minRating || 1000}</span></label>
                        <input
                            type="range" min="1000" max="2500" step="50"
                            value={filters.minRating || 1000}
                            onChange={e => update('minRating', parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                        />
                        <div className="flex justify-between" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            <span>1000</span><span>2500</span>
                        </div>
                    </div>

                    {/* Min Mental Score Slider */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <label className="form-label">Min Mental Score: <span className="text-accent" style={{ fontFamily: 'var(--font-mono)' }}>{filters.minMentalScore || 0}</span></label>
                        <input
                            type="range" min="0" max="100" step="5"
                            value={filters.minMentalScore || 0}
                            onChange={e => update('minMentalScore', parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-secondary)' }}
                        />
                        <div className="flex justify-between" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            <span>0</span><span>100</span>
                        </div>
                    </div>

                    {/* Verified Only Toggle */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                        <div
                            className="flex items-center justify-between"
                            onClick={() => update('verifiedOnly', !filters.verifiedOnly)}
                            style={{ cursor: 'pointer', padding: '6px 0' }}
                        >
                            <label className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Verified Only</label>
                            {filters.verifiedOnly ?
                                <ToggleRight size={28} color="var(--accent-success)" /> :
                                <ToggleLeft size={28} color="var(--text-muted)" />
                            }
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Sort By</label>
                        <select className="form-select" value={filters.sortBy || 'rating_desc'} onChange={e => update('sortBy', e.target.value)} style={{ padding: '10px 12px', minHeight: '40px', fontSize: '0.85rem' }}>
                            <option value="rating_desc">Rating ↓</option>
                            <option value="mental_desc">Mental Score ↓</option>
                            <option value="recent">Recent First</option>
                            <option value="name_asc">Name A-Z</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
