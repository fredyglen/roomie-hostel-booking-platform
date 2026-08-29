import React, { useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight, Building2, BedDouble, Home, Layers,
  Search, KeyRound, Wallet, LineChart, Wrench, ClipboardList, TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/common/Logo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import HeroSearchBar from '@/components/search/HeroSearchBar';
import ROOMiPropertyCard, { GenderPolicy, RoomiAmenity } from '@/components/properties/ROOMiPropertyCard';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useDynamicProperties } from '@/hooks/property/useDynamicProperties';
import { deriveCoverImageFromProperty } from '@/utils/propertyPreviewCache';

/**
 * ROOMi landing page.
 *
 * Three stories, deliberately unequal:
 *
 *   1. Students booking hostels   -- the priority; owns the hero and the
 *                                    first two thirds of the page.
 *   2. Owners listing property    -- a full section, but only after a student
 *                                    has been given somewhere to go.
 *   3. Asset management services  -- the newest line of business, presented
 *                                    last so it does not dilute either.
 *
 * Cover images are shown in full. Registration is triggered when a student
 * opens a listing, not by obscuring what the place looks like -- hiding the
 * photo removes the very thing that makes someone want to click.
 */

const CATEGORIES = [
  { key: 'Hostel', label: 'Hostels', icon: BedDouble, blurb: 'Shared rooms, priced per bed' },
  { key: 'Homestel', label: 'Homestels', icon: Home, blurb: 'Home-style shared living' },
  { key: 'Apartment', label: 'Apartments', icon: Building2, blurb: 'Self-contained units' },
  { key: 'Compound', label: 'Compounds', icon: Layers, blurb: 'Multi-block student estates' },
];

const STEPS = [
  { icon: Search, title: 'Search your campus', body: 'Filter by university, room type and budget. Every listing shows real photos and real prices.' },
  { icon: KeyRound, title: 'Create a free account', body: 'Open a hostel to see the full gallery, video tour and the owner’s contact details.' },
  { icon: ShieldCheck, title: 'Book a verified room', body: 'Pay securely through ROOMi. No agent fees, no cash handoffs to strangers.' },
];

const OWNER_POINTS = [
  { icon: ClipboardList, title: 'List once, fill every bed', body: 'Publish rooms with per-bed pricing and let students book the exact space they want.' },
  { icon: ShieldCheck, title: 'Verification that earns trust', body: 'A verified badge tells students your property is real before they ever call you.' },
  { icon: Wallet, title: 'Get paid without chasing', body: 'Payments settle through the platform, with every transaction recorded.' },
];

const ASSET_POINTS = [
  { icon: Building2, title: 'Portfolio in one view', body: 'Every building, floor, room and bed you operate, with live occupancy.' },
  { icon: Wrench, title: 'Maintenance that gets closed', body: 'Requests raised by students, routed and tracked to completion.' },
  { icon: TrendingUp, title: 'Revenue you can forecast', body: 'Occupancy and income reporting per property and per semester.' },
];

/** Map free-text DB amenities onto the card's six icon slots. */
const AMENITY_MATCHERS: Array<{ key: string; label: string; test: RegExp }> = [
  { key: 'wifi', label: 'Wi-Fi', test: /wi-?fi|internet/i },
  { key: 'ac', label: 'AC', test: /air.?con|\bac\b|fan/i },
  { key: 'tv', label: 'TV', test: /\btv\b|television/i },
  { key: 'kitchen', label: 'Kitchen', test: /kitchen|cooking/i },
  { key: 'gym', label: 'Gym', test: /gym|fitness/i },
  { key: 'parking', label: 'Parking', test: /parking|car park/i },
];

function toCardAmenities(raw: unknown): RoomiAmenity[] {
  const list = Array.isArray(raw) ? raw.map(String) : [];
  const matched = AMENITY_MATCHERS.filter((m) => list.some((a) => m.test.test(a)));
  // Always render six slots so cards line up on a row.
  const filler = AMENITY_MATCHERS.filter((m) => !matched.includes(m));
  return [...matched, ...filler].slice(0, 6).map(({ key, label }) => ({ key, label }));
}

function toGender(value: unknown): GenderPolicy {
  const v = String(value || '').toLowerCase();
  if (v.includes('female') || v.includes('girl')) return 'girls';
  if (v.includes('male') || v.includes('boy')) return 'boys';
  return 'mixed';
}

const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({
  id, className = '', children,
}) => (
  <section id={id} className={className}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

const StudentLanding: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { properties, totalCount } = useDynamicProperties({
    filters: { isAvailable: true },
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const featured = useMemo(() => (properties || []).slice(0, 6), [properties]);

  if (loading) return <LoadingSpinner />;
  if (user) {
    // Roles come from src/types/auth.ts: student | owner | supreme_admin | campus_admin.
    const role = user.role || 'student';
    const target =
      role === 'supreme_admin' || role === 'campus_admin'
        ? '/admin/dashboard'
        : role === 'owner'
          ? '/owner/dashboard'
          : '/student/properties';
    return <Navigate to={target} replace />;
  }

  /** Opening a listing is the moment an account is required. */
  const openProperty = (id: string) => {
    navigate(`/register?next=${encodeURIComponent(`/student/properties/${id}`)}`);
  };

  return (
    <div className="min-h-screen bg-white font-body text-[#0b1f3a]">
      {/* ------------------------------------------------------------------ nav */}
      <header className="sticky top-0 z-50 border-b border-[#e8ecf2] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="ROOMi home"><Logo size="md" withText /></Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#browse" className="text-sm text-[#6f7f98] transition-colors hover:text-[#0b1f3a]">Find a hostel</a>
            <a href="#owners" className="text-sm text-[#6f7f98] transition-colors hover:text-[#0b1f3a]">List your property</a>
            <a href="#assets" className="text-sm text-[#6f7f98] transition-colors hover:text-[#0b1f3a]">Asset management</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/login">Sign in</Link></Button>
            <Button size="sm" className="bg-[#0a5cff] hover:bg-[#0a5cff]/90" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ============================ STORY 1 — STUDENTS ======================= */}
      <section className="relative overflow-hidden border-b border-[#e8ecf2] bg-[#f8fafc]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(10,92,255,0.10),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full bg-white px-3 py-1 font-medium text-[#0b1f3a] shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0a5cff]" />
              Every hostel verified before it goes live
            </Badge>

            <h1 className="font-display text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Find a hostel you can
              <span className="block text-[#0a5cff]">actually trust.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6f7f98] sm:text-lg">
              Real photos, real prices, real bed availability — for hostels,
              homestels and apartments near your campus in Ghana.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <HeroSearchBar />
          </div>

          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-y-8 border-t border-[#e8ecf2] pt-10 sm:grid-cols-4">
            {[
              { v: totalCount ? String(totalCount) : '—', l: 'Verified listings' },
              { v: '87', l: 'Rooms available' },
              { v: '8', l: 'Campuses covered' },
              { v: '₵0', l: 'Agent fees' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <dt className="font-display text-3xl font-bold tracking-tight">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-[#6f7f98]">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* categories */}
      <Section id="browse" className="py-16 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Browse by what you need</h2>
          <p className="mt-3 text-[#6f7f98]">From a single bed in a shared room to a self-contained apartment.</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ key, label, icon: Icon, blurb }) => (
            <Link
              key={key}
              to={`/student/properties?category=${encodeURIComponent(key)}`}
              className="group rounded-2xl border border-[#e8ecf2] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#0a5cff]/40 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a5cff]/10 text-[#0a5cff]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{label}</h3>
              <p className="mt-1 text-sm text-[#6f7f98]">{blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0a5cff]">
                Browse <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* featured listings — ROOMi cards, covers fully visible */}
      <section className="border-y border-[#e8ecf2] bg-[#f8fafc] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Recently verified</h2>
              <p className="mt-3 text-[#6f7f98]">Live listings, updated as owners publish and beds fill up.</p>
            </div>
            <Button variant="outline" className="border-[#e8ecf2]" asChild>
              <Link to="/student/properties" className="gap-2">
                View all listings <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-9 grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[420px] w-full max-w-[390px] animate-pulse rounded-[10px] border border-[#e8ecf2] bg-white" />
                ))
              : featured.map((p: any) => {
                  const total = Number(p.max_occupants ?? p.beds_per_room ?? 0) || 0;
                  const free = Number(p.beds_available ?? 0) || 0;
                  return (
                    <ROOMiPropertyCard
                      key={String(p.id)}
                      id={String(p.id)}
                      title={p.title || p.name || 'Untitled property'}
                      location={[p.address, p.city].filter(Boolean).join(', ') || 'Location on request'}
                      price={p.rent ?? p.price ?? null}
                      coverImage={deriveCoverImageFromProperty(p)}
                      gender={toGender(p.gender_restriction)}
                      roomLabel={total ? `${total} in a room` : '1 in a room'}
                      taken={Math.max(total - free, 0)}
                      total={total}
                      amenities={toCardAmenities(p.amenities)}
                      hasVideo={Boolean(p.virtual_tour_url)}
                      onOpen={() => openProperty(String(p.id))}
                      onFavorite={() => openProperty(String(p.id))}
                      onVideo={() => openProperty(String(p.id))}
                    />
                  );
                })}
          </div>
        </div>
      </section>

      {/* how it works */}
      <Section className="py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Three steps to a room</h2>
        </div>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a5cff] text-white">
                <Icon className="h-5 w-5" />
              </div>
              <span className="mb-2 block font-display text-xs font-bold tracking-widest text-[#0a5cff]">
                STEP {i + 1}
              </span>
              <h3 className="font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6f7f98]">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ============================ STORY 2 — OWNERS ========================= */}
      <section id="owners" className="border-y border-[#e8ecf2] bg-[#0b1f3a] py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#4d9fff]">For property owners</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Fill your beds without the runaround.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/70">
                Students are already searching for rooms near your campus.
                List once and let them find you — no agents taking a cut,
                no repeating the same details over WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="rounded-full bg-white px-7 text-[#0b1f3a] hover:bg-white/90" asChild>
                  <Link to="/register?role=owner">List your property</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent px-7 text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/owner-landing">How it works for owners</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
              {OWNER_POINTS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <Icon className="mb-4 h-5 w-5 text-[#4d9fff]" />
                  <h3 className="font-heading text-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STORY 3 — ASSET MANAGEMENT ==================== */}
      <Section id="assets" className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-3">
            {ASSET_POINTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-[#e8ecf2] bg-white p-5">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a5cff]/10 text-[#0a5cff]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6f7f98]">{body}</p>
              </div>
            ))}
          </div>

          <div className="lg:order-first">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0a5cff]">Asset management</span>
              <Badge variant="secondary" className="text-[10px]">New</Badge>
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Run a portfolio, not a spreadsheet.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-[#6f7f98]">
              For owners and managers running student housing at scale — occupancy,
              maintenance and revenue across every building, floor and bed,
              in one place.
            </p>
            <Button size="lg" variant="outline" className="mt-8 gap-2 rounded-full border-[#e8ecf2] px-7" asChild>
              <Link to="/register?role=owner">
                <LineChart className="h-4 w-4" /> Talk to us about your portfolio
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- closing CTA */}
      <Section className="pb-20">
        <div className="rounded-3xl bg-[#0a5cff] px-8 py-16 text-center text-white">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Find your room before the semester starts
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">
            Free to join. Free to browse. No agent fees.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="rounded-full bg-white px-8 text-[#0a5cff] hover:bg-white/90" asChild>
              <Link to="/register">Create free account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/student/properties">Browse hostels</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- footer */}
      <footer className="border-t border-[#e8ecf2]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
          <Logo size="sm" withText />
          <p className="text-xs text-[#6f7f98]">
            © {new Date().getFullYear()} ROOMi. Student housing in Ghana.
          </p>
          <div className="flex gap-6 text-xs text-[#6f7f98]">
            <Link to="/login" className="hover:text-[#0b1f3a]">Sign in</Link>
            <Link to="/register" className="hover:text-[#0b1f3a]">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLanding;
