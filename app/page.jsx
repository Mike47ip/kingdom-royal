'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, Star, Search, ChevronDown,
  Sparkles, MapPin, Phone, Waves, Wine,
  Users, Dumbbell, UtensilsCrossed, Car, BriefcaseBusiness
} from 'lucide-react'
import { getHotels } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

const SERVICES_PREVIEW = [
  { icon: Waves,           label: 'Swimming Pool'    },
  { icon: Wine,            label: 'Bar & Lounge'     },
  { icon: BriefcaseBusiness, label: 'Conference'     },
  { icon: Dumbbell,        label: 'Gym & Fitness'    },
  { icon: UtensilsCrossed, label: 'Restaurant'       },
  { icon: Car,             label: 'Transport'        },
]

export default function HomePage() {
  const router = useRouter()
  const [hotels,   setHotels]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [search,   setSearch]   = useState('')
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    getHotels()
      .then(setHotels)
      .catch(() => setError('Unable to load. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.city || '').toLowerCase().includes(search.toLowerCase())
  )

  const scrollDown = () =>
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-charcoal">

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500 px-6 py-4 flex items-center justify-between"
        style={{
          background:    scrolled ? 'rgba(13,13,13,0.96)' : 'transparent',
          backdropFilter:scrolled ? 'blur(20px)'          : 'none',
          borderBottom:  scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
        }}
      >
        <div className="animate-slide-left">
          <p className="text-gold text-xl font-semibold tracking-tight leading-none" style={{ fontFamily:'var(--font-outfit)' }}>
            Kingdom Royal
          </p>
          <p className="text-white/30 text-[0.55rem] tracking-[0.28em] uppercase mt-0.5">Reserve Your Stay</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/services')}
            className="btn-ghost-white text-[0.68rem]"
          >
            Our Services
          </button>
          <button
            onClick={() => router.push('/my-booking')}
            className="btn-gold text-[0.68rem] py-2 px-4"
          >
            Track Enquiry
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/3d-rendering-beautiful-comtemporary-luxury-bedroom-suite-hotel-with-tv.jpg')",
            animation: 'subtleZoom 20s ease-in-out infinite alternate',
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at center, transparent 40%, rgba(13,13,13,0.65) 100%)' }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-28 pb-16">
          <div className="animate-fade-up stagger-1 inline-flex mb-8">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-gold-light text-[0.65rem] tracking-[0.2em] uppercase font-medium">
                Luxury Accommodation · Ghana
              </span>
            </div>
          </div>

          <h1
            className="animate-fade-up stagger-2 font-semibold text-white leading-[1.08] mb-6"
            style={{ fontFamily:'var(--font-outfit)', fontSize:'clamp(2.8rem,7vw,5rem)', letterSpacing:'-0.02em' }}
          >
            Find Your <span className="block text-shimmer">Perfect Retreat</span>
          </h1>

          <p className="animate-fade-up stagger-3 text-white/55 leading-relaxed mb-10 max-w-lg mx-auto font-light" style={{ fontSize:'clamp(0.95rem,2vw,1.05rem)' }}>
            Luxury rooms, world-class amenities, and personalised service — all in one place.
            Submit your enquiry and our team will confirm everything.
          </p>

          <div className="animate-fade-up stagger-4 relative max-w-md mx-auto mb-10">
            <div className="glass-card flex items-center gap-3 px-4 py-3.5 focus-within:border-gold/50 focus-within:bg-white/15 transition-all duration-300">
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                type="text"
                placeholder="Search by hotel or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/35 outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/60 transition-colors text-xs bg-transparent border-0 cursor-pointer">✕</button>
              )}
            </div>
          </div>

          <div className="animate-fade-up stagger-5 flex items-center justify-center gap-4 flex-wrap">
            <button onClick={scrollDown} className="btn-gold px-8 py-3.5 text-[0.75rem]">
              Browse Hotels <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => router.push('/services')} className="btn-ghost-white px-8 py-3.5 text-[0.75rem]">
              View Services
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up stagger-6 flex items-center justify-center gap-8 mt-14 pt-10 border-t border-white/10">
            {[
              { value:'5★',   label:'Luxury rated'     },
              { value:'24h',  label:'Response time'    },
              { value:'100%', label:'Personal service' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-gold text-lg font-semibold leading-none mb-1" style={{ fontFamily:'var(--font-outfit)' }}>{value}</p>
                <p className="text-white/35 text-[0.68rem] tracking-wider uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={scrollDown} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0 animate-bounce-slow">
          <span className="text-white/25 text-[0.6rem] tracking-[0.2em] uppercase">Explore</span>
          <ChevronDown className="w-4 h-4 text-white/30" />
        </button>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </section>

      {/* ── SERVICES STRIP ───────────────────────────────── */}
      <section className="bg-charcoal-soft border-y border-gold/15 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-white/30 text-[0.62rem] tracking-[0.22em] uppercase mb-6">On-Site Amenities & Services</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {SERVICES_PREVIEW.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => router.push('/services')}
                className="flex flex-col items-center gap-2 p-3 border border-white/8 hover:border-gold/40 hover:bg-white/5 transition-all duration-200 cursor-pointer bg-transparent group"
              >
                <Icon className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
                <span className="text-white/40 group-hover:text-white/70 text-[0.62rem] tracking-wide uppercase text-center transition-colors">{label}</span>
              </button>
            ))}
          </div>
          <div className="text-center mt-5">
            <button onClick={() => router.push('/services')} className="text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-1.5 mx-auto">
              View all services & enquire <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOTELS ───────────────────────────────────────── */}
      <section id="properties" className="bg-cream">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-gold text-[0.65rem] tracking-[0.2em] uppercase font-semibold mb-2">Our Properties</p>
              <h2
                className="text-charcoal font-semibold leading-tight"
                style={{ fontFamily:'var(--font-outfit)', fontSize:'clamp(1.8rem,4vw,2.5rem)', letterSpacing:'-0.02em' }}
              >
                {search ? `Results for "${search}"` : 'Luxury Hotels'}
              </h2>
            </div>
            {!loading && (
              <span className="text-warm-gray text-sm">{filtered.length} propert{filtered.length === 1 ? 'y' : 'ies'}</span>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          {loading && <Spinner label="Loading hotels..." />}
          {error   && <div className="bg-red-50 border border-red-200 px-6 py-4 text-red-700 text-sm text-center">{error}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-charcoal mb-2 font-medium" style={{ fontFamily:'var(--font-outfit)' }}>No hotels found</p>
              <p className="text-warm-gray text-sm">Try a different search term</p>
            </div>
          )}
          <div className="grid gap-6" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))' }}>
            {filtered.map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} delay={i * 0.06} onClick={() => router.push(`/${hotel.slug}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-charcoal border-t border-gold/15 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-gold text-lg font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Kingdom Royal</p>
            <p className="text-white/25 text-xs mt-1">Luxury Hotels · Ghana</p>
          </div>
          <div className="flex gap-6">
            <button onClick={() => router.push('/services')} className="text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors bg-transparent border-0 cursor-pointer">Services</button>
            <button onClick={() => router.push('/my-booking')} className="text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors bg-transparent border-0 cursor-pointer">Track Enquiry</button>
          </div>
          <p className="text-white/20 text-xs">For confirmed bookings, our team will contact you directly.</p>
        </div>
      </footer>

      <style>{`
        @keyframes subtleZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
      `}</style>
    </div>
  )
}

function HotelCard({ hotel, delay, onClick }) {
  return (
    <div
      className="card animate-fade-up cursor-pointer group overflow-hidden"
      style={{ animationDelay:`${delay}s`, opacity:0 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="h-48 bg-charcoal-soft relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage:'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize:'22px 22px' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        <div className="relative text-center z-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center animate-glow">
            <span className="text-gold text-2xl font-bold" style={{ fontFamily:'var(--font-outfit)' }}>{hotel.name.charAt(0)}</span>
          </div>
          <div className="flex justify-center gap-0.5">
            {[...Array(5)].map((_,i) => <Star key={i} className="w-2.5 h-2.5 fill-gold text-gold" />)}
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-gold/90 text-white text-[0.58rem] px-2.5 py-1 font-semibold tracking-wider uppercase">Luxury</span>
        </div>
      </div>
      <div className="p-6">
        <h3
          className="text-xl text-charcoal font-semibold mb-3 leading-tight group-hover:text-gold-dark transition-colors duration-200"
          style={{ fontFamily:'var(--font-outfit)', letterSpacing:'-0.01em' }}
        >
          {hotel.name}
        </h3>
        <div className="space-y-1.5 mb-5">
          {(hotel.city || hotel.address) && (
            <div className="flex items-center gap-2 text-warm-gray text-xs">
              <MapPin className="w-3 h-3 text-gold shrink-0" />{hotel.address || hotel.city}, {hotel.country}
            </div>
          )}
          {hotel.phone && (
            <div className="flex items-center gap-2 text-warm-gray text-xs">
              <Phone className="w-3 h-3 text-gold shrink-0" />{hotel.phone}
            </div>
          )}
        </div>

        {/* Services preview pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Pool','Bar','Conference','Gym'].map(s => (
            <span key={s} className="text-[0.6rem] px-2 py-0.5 bg-cream border border-warm-border text-warm-gray tracking-wide uppercase">{s}</span>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-warm-border via-gold/20 to-warm-border mb-5" />
        <button className="btn-gold w-full text-[0.72rem]">
          View Rooms <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}