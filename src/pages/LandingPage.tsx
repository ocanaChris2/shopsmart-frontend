import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid, ArrowRight, Check,
  Database, Package, ShoppingCart, BarChart2, Layers, Shield,
  Menu, X, ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Feature { number: string; icon: LucideIcon; title: string; body: string }
interface Step    { number: string; title: string; body: string }
interface Plan    { name: string; price: number | null; period: string; tagline: string; features: string[]; cta: string; ctaHref: string; highlight: boolean }

// ── Static data ───────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  { number: '01', icon: Database,     title: 'Dynamic Schema Engine',   body: 'Define any business entity through configuration, not code. Products, orders, assets — your data model adapts as your business evolves without a single migration script.' },
  { number: '02', icon: Package,      title: 'Real-time Inventory',     body: 'Track stock levels, movements, and valuations across all locations. Automated reorder alerts keep operations running without manual oversight.' },
  { number: '03', icon: ShoppingCart, title: 'Order Pipeline',          body: 'End-to-end lifecycle management from quote to fulfillment. Every status transition logged, every stakeholder notified automatically.' },
  { number: '04', icon: BarChart2,    title: 'Financial Intelligence',  body: 'Profit & loss, cash flow, and balance sheets generated from your operational data — no manual reconciliation, no spreadsheets.' },
  { number: '05', icon: Layers,       title: 'Multi-workspace',         body: 'One platform serving multiple business units, regions, or clients. Complete data isolation with a unified administration layer.' },
  { number: '06', icon: Shield,       title: 'Granular Access Control', body: 'Role-based permissions down to the field level. Define exactly what each team member can read, write, or manage.' },
];

const STEPS: Step[] = [
  { number: '01', title: 'Define your schema',  body: 'Use the visual entity builder to model your business objects — products, customers, contracts — without writing a single line of code.' },
  { number: '02', title: 'Import your data',    body: 'Connect spreadsheets or existing databases. The ingestion engine validates and maps your data to your schema automatically.' },
  { number: '03', title: 'Operate at scale',    body: 'Query, filter, and report across all entities from a single interface. Extend the schema as your business grows — no migrations required.' },
];

const PLANS: Plan[] = [
  {
    name: 'Starter', price: 0, period: 'forever', tagline: 'For small teams getting started',
    features: ['Up to 3 entities', '1 workspace', '2 users', 'Community support', 'API access'],
    cta: 'Get started free', ctaHref: '/signup', highlight: false,
  },
  {
    name: 'Growth', price: 49, period: 'per month', tagline: 'For growing operations',
    features: ['Unlimited entities', '3 workspaces', '15 users', 'Email support', 'API access', 'Custom roles'],
    cta: 'Start free trial', ctaHref: '/signup', highlight: true,
  },
  {
    name: 'Enterprise', price: null, period: 'custom pricing', tagline: 'For large-scale deployments',
    features: ['Unlimited everything', 'Unlimited workspaces', 'SSO / SAML', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
    cta: 'Contact sales', ctaHref: '/login', highlight: false,
  },
];

const NAV_LINKS: [string, string][] = [
  ['#features',     'Features'],
  ['#how-it-works', 'How it works'],
  ['#pricing',      'Pricing'],
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.2em] text-indigo-400 uppercase mb-4">
      {text}
    </p>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <LayoutGrid className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold text-sm tracking-tight text-white">ShopSmart ERP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="text-sm text-slate-400 hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white transition-colors"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-slate-950 px-6 py-4 space-y-4">
          {NAV_LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="block text-sm text-slate-400 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link to="/login"  className="block text-sm text-slate-300 hover:text-white transition-colors">Sign in</Link>
          <Link to="/signup" className="block text-sm text-white font-semibold">Sign up →</Link>
        </div>
      )}
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function DashboardMockup() {
  const rows: { sku: string; name: string; stock: string; color: string }[] = [
    { sku: 'PRD-001', name: 'Wireless Module', stock: '1,432', color: 'text-emerald-400' },
    { sku: 'PRD-002', name: 'Signal Board',    stock: '89',    color: 'text-rose-400'    },
    { sku: 'PRD-003', name: 'Power Cell',      stock: '4,901', color: 'text-slate-300'   },
    { sku: 'PRD-004', name: 'Lens Assembly',   stock: '0',     color: 'text-rose-400'    },
    { sku: 'PRD-005', name: 'Control Unit',    stock: '203',   color: 'text-emerald-400' },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur overflow-hidden shadow-2xl shadow-black/40 font-mono text-xs">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-950/60">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-slate-500">INVENTORY MODULE · 3,422 records</span>
        <span className="text-indigo-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
          LIVE
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-4 px-4 py-2 border-b border-white/5 text-slate-600 uppercase tracking-wider text-[10px]">
        <span>// SKU</span>
        <span className="col-span-2">NAME</span>
        <span className="text-right">STOCK</span>
      </div>

      {rows.map((row) => (
        <div
          key={row.sku}
          className="grid grid-cols-4 px-4 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-indigo-300">{row.sku}</span>
          <span className="col-span-2 text-slate-300">{row.name}</span>
          <span className={cn('text-right tabular-nums', row.color)}>{row.stock}</span>
        </div>
      ))}

      {/* Capacity bar */}
      <div className="px-4 py-3 flex items-center gap-3 bg-slate-950/40">
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full" />
        </div>
        <span className="text-slate-500 shrink-0">68% capacity</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative pt-32 pb-24 overflow-hidden"
      style={{
        backgroundImage: [
          'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)',
          'linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '64px 64px',
      }}
    >
      {/* Radial glow behind hero text */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.18), transparent)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-mono text-xs text-indigo-300">v1.0 · Now in production</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            One platform to run your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              entire operation
            </span>
          </h1>

          <p className="mt-6 text-base text-slate-400 leading-relaxed max-w-lg">
            ShopSmart ERP eliminates the chaos of managing inventory, orders, and finances
            across disconnected tools — replacing them with a single, schema-driven platform
            that adapts to your business.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              See how it works <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
            {[
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '<50ms', label: 'API latency' },
              { value: '10×',   label: 'Faster than legacy ERP' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-mono text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: dashboard mockup */}
        <div className="hidden lg:block">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel text="// 01 PLATFORM" />
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Everything you need to run the business
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed self-end">
            Built for the operational complexity of modern retail and distribution,
            with the flexibility to fit any business model.
          </p>
        </div>

        {/* Feature grid — separated by 1px gaps filled with the border color */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
          {FEATURES.map(({ number, icon: Icon, title, body }) => (
            <div
              key={number}
              className="bg-slate-950 p-6 hover:bg-slate-900/60 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-md border border-indigo-500/20 bg-indigo-500/10 p-2 shrink-0">
                  <Icon className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="font-mono text-xs text-slate-700 group-hover:text-slate-600 transition-colors">
                  {number}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel text="// 02 PROCESS" />
        <h2 className="text-3xl font-bold text-white tracking-tight mb-16">
          Up and running in hours, not months
        </h2>

        <div className="grid md:grid-cols-3 relative">
          {/* Connector line between step circles */}
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-indigo-500/50 via-indigo-500/20 to-indigo-500/50" />

          {STEPS.map(({ number, title, body }, i) => (
            <div
              key={number}
              className={cn('relative', i === 0 ? 'pr-8' : i === STEPS.length - 1 ? 'pl-8' : 'px-8')}
            >
              <div className="relative z-10 mb-6 h-14 w-14 rounded-full border border-indigo-500/40 bg-slate-950 flex items-center justify-center ring-4 ring-slate-950">
                <span className="font-mono text-sm font-semibold text-indigo-400">{number}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-3">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel text="// 03 PRICING" />
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
          Transparent pricing, no surprises
        </h2>
        <p className="text-slate-400 text-sm mb-12">
          Start free. Scale when you need to. No credit card required.
        </p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map(({ name, price, period, tagline, features, cta, ctaHref, highlight }) => (
            <div
              key={name}
              className={cn(
                'relative rounded-xl border p-6 flex flex-col',
                highlight
                  ? 'border-indigo-500/50 bg-indigo-950/30 shadow-lg shadow-indigo-500/5'
                  : 'border-white/10 bg-slate-900/30',
              )}
            >
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="font-mono text-[10px] font-semibold text-white bg-indigo-600 px-3 py-1 rounded-md">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2">{name}</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  {price === null ? (
                    <span className="text-3xl font-bold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-white">
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-slate-500 text-sm">/ {period}</span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500">{tagline}</p>
              </div>

              {/* CTA */}
              <Link
                to={ctaHref}
                className={cn(
                  'block w-full rounded-md py-2 text-center text-sm font-medium transition-colors mb-6',
                  highlight
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'border border-white/10 hover:border-white/20 text-slate-300 hover:text-white',
                )}
              >
                {cta}
              </Link>

              {/* Feature list */}
              <ul className="space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-3.5 w-3.5 shrink-0 text-indigo-400 mt-0.5" />
                    <span className="text-xs text-slate-400">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();

  const footerSections: { heading: string; links: string[] }[] = [
    { heading: 'Product', links: ['Features', 'Pricing', 'Roadmap', 'Changelog'] },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact']         },
    { heading: 'Support', links: ['Documentation', 'API reference', 'Status', 'Community'] },
  ];

  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid sm:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid className="h-4 w-4 text-indigo-400" />
              <span className="font-semibold text-sm text-white">ShopSmart ERP</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The schema-driven ERP for modern operations.
            </p>
          </div>

          {footerSections.map(({ heading, links }) => (
            <div key={heading}>
              <p className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-3">
                {heading}
              </p>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="font-mono text-xs text-slate-600">
            © {year} ShopSmart ERP. All rights reserved.
          </p>
          <p className="font-mono text-xs text-slate-700">
            Built with TypeScript · React · Vite
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
