import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, GraduationCap, BedDouble, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Primary search entry point for students.
 *
 * Everything a student actually filters on first is on one row: where they
 * study, what kind of place, and how much. Anything finer lives behind "More
 * filters" on the results page rather than crowding the landing screen.
 *
 * Submitting always lands on /student/properties with query params, so the
 * results page owns the filtering and this component stays presentational.
 */

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'Hostel', label: 'Hostels' },
  { key: 'Homestel', label: 'Homestels' },
  { key: 'Apartment', label: 'Apartments' },
];

const UNIVERSITIES = [
  'University of Ghana, Legon',
  'KNUST, Kumasi',
  'University of Cape Coast',
  'UPSA, Accra',
  'GIMPA, Accra',
  'Ashesi University',
  'Central University',
  'Valley View University',
];

const OCCUPANCY = [
  { value: '', label: 'Any room type' },
  { value: '1', label: '1 in a room' },
  { value: '2', label: '2 in a room' },
  { value: '3', label: '3 in a room' },
  { value: '4', label: '4 in a room' },
];

const BUDGETS = [
  { value: '', label: 'Any budget' },
  { value: '0-1000', label: 'Under ₵1,000' },
  { value: '1000-2500', label: '₵1,000 – ₵2,500' },
  { value: '2500-5000', label: '₵2,500 – ₵5,000' },
  { value: '5000-', label: '₵5,000+' },
];

const FIELD =
  'h-12 w-full min-w-0 appearance-none bg-transparent pl-10 pr-3 text-sm text-[#0b1f3a] ' +
  'placeholder:text-[#6f7f98] focus:outline-none';

interface HeroSearchBarProps {
  className?: string;
}

const HeroSearchBar: React.FC<HeroSearchBarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [university, setUniversity] = useState('');
  const [occupancy, setOccupancy] = useState('');
  const [budget, setBudget] = useState('');
  const [keyword, setKeyword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (category) params.set('category', category);
    if (university) params.set('university', university);
    if (occupancy) params.set('occupancy', occupancy);
    if (budget) params.set('budget', budget);
    navigate(`/student/properties${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Category tabs sit on top of the panel, so the panel reads as one object. */}
      <div className="mx-auto flex w-fit gap-1 rounded-t-xl bg-white/95 p-1.5 shadow-sm backdrop-blur">
        {CATEGORIES.map((c) => (
          <button
            key={c.key || 'all'}
            type="button"
            onClick={() => setCategory(c.key)}
            aria-pressed={category === c.key}
            className={
              'rounded-lg px-4 py-2 text-sm font-semibold transition-colors ' +
              (category === c.key
                ? 'bg-[#0b1f3a] text-white'
                : 'text-[#6f7f98] hover:bg-[#f1f4f9] hover:text-[#0b1f3a]')
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="rounded-2xl border border-[#e8ecf2] bg-white p-2 shadow-[0_8px_30px_rgba(11,31,58,0.10)]"
      >
        <div className="grid gap-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center">
          {/* university / area */}
          <label className="relative flex items-center rounded-xl border border-transparent hover:border-[#e8ecf2] lg:border-r lg:border-r-[#e8ecf2] lg:rounded-none lg:pr-2">
            <GraduationCap className="pointer-events-none absolute left-3 h-4 w-4 text-[#0a5cff]" />
            <span className="sr-only">University or area</span>
            <input
              list="roomi-universities"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="University or area"
              className={FIELD}
            />
            <datalist id="roomi-universities">
              {UNIVERSITIES.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </label>

          {/* occupancy */}
          <label className="relative flex items-center rounded-xl border border-transparent hover:border-[#e8ecf2] lg:border-r lg:border-r-[#e8ecf2] lg:rounded-none lg:pr-2">
            <BedDouble className="pointer-events-none absolute left-3 h-4 w-4 text-[#0a5cff]" />
            <span className="sr-only">Room type</span>
            <select value={occupancy} onChange={(e) => setOccupancy(e.target.value)} className={`${FIELD} cursor-pointer`}>
              {OCCUPANCY.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          {/* budget */}
          <label className="relative flex items-center rounded-xl border border-transparent hover:border-[#e8ecf2] lg:rounded-none">
            <SlidersHorizontal className="pointer-events-none absolute left-3 h-4 w-4 text-[#0a5cff]" />
            <span className="sr-only">Budget per semester</span>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className={`${FIELD} cursor-pointer`}>
              {BUDGETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>

          <Button
            type="submit"
            className="h-12 gap-2 rounded-xl bg-[#0a5cff] px-7 text-sm font-semibold hover:bg-[#0a5cff]/90 lg:w-auto"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* keyword: secondary, so it does not compete with the structured filters */}
        <label className="relative mt-2 flex items-center border-t border-[#e8ecf2] pt-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7f98]" />
          <span className="sr-only">Hostel name or landmark</span>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Or search by hostel name or landmark"
            className="h-10 w-full bg-transparent pl-10 pr-3 text-sm text-[#0b1f3a] placeholder:text-[#6f7f98] focus:outline-none"
          />
        </label>
      </form>
    </div>
  );
};

export default HeroSearchBar;
