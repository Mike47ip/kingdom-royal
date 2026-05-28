'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Phone, ArrowRight, Star, Search, ChevronDown } from 'lucide-react'
import { getHotels } from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

export default function HomePage() {
  const router = useRouter()
  const [hotels,  setHotels]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    getHotels()
      .then(setHotels)
      .catch(() => setError('Unable to load hotels. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.city || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-cream">

      {/* NAV */}
      <nav className="bg-charcoal px-6 py-5 flex items-center justify-between">
        <div>
          <p className="font-[family-name:var(--font-playfair)] text-gold text-2xl tracking-tight leading-none">
            Kingdom Royal
          </p>
          <p className="text-white/30 text-[0.6rem] tracking-[0.22em] uppercase mt-0.5">
            Reserve Your Stay
          </p>
        </div>
        <button onClick={() => router.push('/my-booking')} className="btn-outline-white">
          Track My Enquiry
        </button>
      </nav>

      {/* HERO */}
      <section className="bg-charcoal pb-20 pt-16 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize: '38px 38px' }}
        />
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="animate-fade-up stagger-1 inline-flex items-center gap-2 bg-gold/10 border border-gold/25 text-gold-light text-[0.62rem] tracking-[0.22em] uppercase px-4 py-1.5 mb-6">
            Luxury Accommodation · Ghana
          </div>
          <h1
            className="animate-fade-up stagger-2 font-[family-name:var(--font-playfair)] text-white font-normal leading-[1.12] mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}
          >
            Find Your Perfect{' '}
            <em className="text-gold not-italic">Retreat</em>
          </h1>
          <p className="animate-fade-up stagger-3 text-white/50 text-[0.95rem] leading-relaxed mb-9 font-light max-w-md mx-auto">
            Browse our collection of hotels and submit your booking enquiry. Our team will personally confirm your reservation.
          </p>
          <div className="animate-fade-up stagger-4 relative max-w-sm mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by hotel or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/8 border border-white/12 text-white text-sm placeholder:text-white/30 outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>
        <div className="mt-14 flex justify-center">
          <ChevronDown className="w-5 h-5 text-white/25 animate-bounce-slow" />
        </div>
      </section>

      <hr className="divider-gold" />

      {/* HOTELS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-charcoal font-normal">
            {search ? `Results for "${search}"` : 'Our Hotels'}
          </h2>
          {!loading && (
            <span className="text-warm-gray text-sm">
              {filtered.length} propert{filtered.length === 1 ? 'y' : 'ies'}
            </span>
          )}
        </div>

        {loading && <Spinner label="Loading hotels..." />}

        {error && (
          <div className="bg-red-50 border border-red-200 px-6 py-4 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-[family-name:var(--font-playfair)] text-xl text-charcoal mb-2">No hotels found</p>
            <p className="text-warm-gray text-sm">Try a different search term</p>
          </div>
        )}

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filtered.map((hotel, i) => (
            <HotelCard key={hotel.id} hotel={hotel} delay={i * 0.05} onClick={() => router.push(`/${hotel.slug}`)} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal py-10 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-gold text-lg mb-2">Kingdom Royal</p>
        <p className="text-white/30 text-xs">For confirmed bookings, our team will contact you directly.</p>
      </footer>
    </div>
  )
}

function HotelCard({ hotel, delay, onClick }) {
  return (
    <div
      className="card animate-fade-up cursor-pointer"
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="h-44 bg-charcoal-soft relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize: '22px 22px' }}
        />
        <div className="relative text-center">
          <span className="font-[family-name:var(--font-playfair)] text-gold text-5xl font-semibold">
            {hotel.name.charAt(0)}
          </span>
          <div className="flex justify-center gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-gold text-gold" />)}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-charcoal font-semibold mb-3 leading-tight">
          {hotel.name}
        </h3>
        <div className="space-y-1.5 mb-5">
          {(hotel.city || hotel.address) && (
            <div className="flex items-center gap-2 text-warm-gray text-xs">
              <MapPin className="w-3 h-3 text-gold shrink-0" />
              {hotel.address || hotel.city}, {hotel.country}
            </div>
          )}
          {hotel.phone && (
            <div className="flex items-center gap-2 text-warm-gray text-xs">
              <Phone className="w-3 h-3 text-gold shrink-0" />
              {hotel.phone}
            </div>
          )}
        </div>
        <hr className="border-warm-border mb-5" />
        <button className="btn-gold w-full text-[0.72rem]">
          View Rooms <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
