'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Calendar, Users, Wifi, Wind, Tv, CheckCircle,
  RefreshCw, BedDouble, ArrowRight, MapPin, Phone, Star
} from 'lucide-react'
import { getRooms } from '@/lib/api'
import Navbar from '@/components/ui/Navbar'
import Spinner from '@/components/ui/Spinner'

const TYPE_LABELS = {
  STANDARD:     'Standard Room',
  DELUXE:       'Deluxe Room',
  SUITE:        'Suite',
  EXECUTIVE:    'Executive Suite',
  PRESIDENTIAL: 'Presidential Suite',
}
const TYPE_ORDER = ['STANDARD', 'DELUXE', 'SUITE', 'EXECUTIVE', 'PRESIDENTIAL']

const today    = () => new Date().toISOString().split('T')[0]
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] }
const fmtGHS   = n  => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(n)
const nights   = (a, b) => (!a || !b) ? 0 : Math.max(0, Math.ceil((new Date(b) - new Date(a)) / 86400000))

export default function HotelRoomsPage() {
  const router        = useRouter()
  const { slug }      = useParams()
  const [hotel,       setHotel]       = useState(null)
  const [rooms,       setRooms]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [refreshing,  setRefreshing]  = useState(false)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [checkIn,     setCheckIn]     = useState(today())
  const [checkOut,    setCheckOut]    = useState(tomorrow())
  const [guests,      setGuests]      = useState(1)
  const pollRef = useRef(null)

  const fetchRooms = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const data = await getRooms(slug, checkIn, checkOut)
      setHotel(data.hotel)
      setRooms(data.rooms)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [slug, checkIn, checkOut])

  useEffect(() => { setLoading(true); fetchRooms() }, [fetchRooms])

  useEffect(() => {
    pollRef.current = setInterval(() => fetchRooms(true), 30000)
    return () => clearInterval(pollRef.current)
  }, [fetchRooms])

  const nightCount = nights(checkIn, checkOut)
  const byType = TYPE_ORDER.reduce((acc, t) => {
    const list = rooms.filter(r => r.roomType === t && r.capacity >= guests)
    if (list.length) acc[t] = list
    return acc
  }, {})

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar back="/" backLabel="All Hotels" title={slug} />
      <Spinner label="Loading rooms..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <Navbar back="/" backLabel="All Hotels" title={hotel?.name || slug}>
        {refreshing && (
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <RefreshCw className="w-3 h-3 animate-spin-slow" /> Updating
          </span>
        )}
        <button onClick={() => router.push('/my-booking')} className="btn-outline-white">
          My Enquiry
        </button>
      </Navbar>

      {/* Hotel header */}
      {hotel && (
        <div className="bg-charcoal-soft border-b border-gold/20 px-6 py-7">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="font-[family-name:var(--font-playfair)] text-white font-normal leading-tight mb-2"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
              >
                {hotel.name}
              </h1>
              <div className="flex gap-5 flex-wrap">
                {hotel.city && (
                  <span className="flex items-center gap-1.5 text-white/45 text-xs">
                    <MapPin className="w-3 h-3 text-gold" /> {hotel.city}
                  </span>
                )}
                {hotel.phone && (
                  <span className="flex items-center gap-1.5 text-white/45 text-xs">
                    <Phone className="w-3 h-3 text-gold" /> {hotel.phone}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
            </div>
          </div>
        </div>
      )}

      {/* Date filter bar */}
      <div className="bg-white border-b border-warm-border px-6 py-4 sticky top-[70px] z-40">
        <div className="max-w-6xl mx-auto flex items-end gap-4 flex-wrap">
          <div>
            <label className="label-field">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
              <input
                type="date"
                value={checkIn}
                min={today()}
                onChange={e => {
                  setCheckIn(e.target.value)
                  if (e.target.value >= checkOut) {
                    const d = new Date(e.target.value)
                    d.setDate(d.getDate() + 1)
                    setCheckOut(d.toISOString().split('T')[0])
                  }
                }}
                className="input-field pl-9 w-40 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
              <input
                type="date"
                value={checkOut}
                min={checkIn || today()}
                onChange={e => setCheckOut(e.target.value)}
                className="input-field pl-9 w-40 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
              <select
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="input-field pl-9 w-32 text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ml-auto text-right">
            {nightCount > 0 && (
              <p className="text-warm-gray text-xs mb-0.5">{nightCount} night{nightCount > 1 ? 's' : ''}</p>
            )}
            {lastUpdated && (
              <p className="text-warm-gray text-[0.68rem] opacity-50">
                Updated {lastUpdated.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Room listings */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 px-5 py-3 text-red-700 text-sm mb-6">{error}</div>
        )}

        {Object.keys(byType).length === 0 && !error && (
          <div className="text-center py-20">
            <BedDouble className="w-10 h-10 text-warm-border mx-auto mb-4" />
            <p className="font-[family-name:var(--font-playfair)] text-xl text-charcoal mb-2">No rooms available</p>
            <p className="text-warm-gray text-sm">Try different dates or fewer guests</p>
          </div>
        )}

        {Object.entries(byType).map(([type, list]) => (
          <div key={type} className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-charcoal font-normal whitespace-nowrap">
                {TYPE_LABELS[type]}
              </h2>
              <div className="flex-1 h-px bg-warm-border" />
              <span className="text-warm-gray text-xs whitespace-nowrap">{list.length} available</span>
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {list.map((room, i) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  nights={nightCount}
                  delay={i * 0.04}
                  onEnquire={() =>
                    router.push(`/${slug}/book?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

function RoomCard({ room, nights, delay, onEnquire }) {
  const amenities = Array.isArray(room.amenities) ? room.amenities : []
  const estimate  = nights > 0 ? room.pricePerNight * nights : null
  const ICONS     = { WiFi: Wifi, AC: Wind, TV: Tv }

  return (
    <div className="card animate-fade-up" style={{ animationDelay: `${delay}s`, opacity: 0 }}>
      {/* Placeholder */}
      <div className="h-40 bg-charcoal-soft relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize: '20px 20px' }}
        />
        <div className="relative flex flex-col items-center gap-2">
          <BedDouble className="w-8 h-8 text-gold/50" />
          <span className="text-white/35 text-[0.65rem] tracking-widest uppercase">Room {room.roomNumber}</span>
        </div>
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
          {room.hasBalcony && (
            <span className="bg-gold/90 text-white text-[0.58rem] px-2 py-0.5 tracking-wide uppercase">Balcony</span>
          )}
          {room.hasSeaView && (
            <span className="bg-blue-500/85 text-white text-[0.58rem] px-2 py-0.5 tracking-wide uppercase">Sea View</span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-2xl text-charcoal leading-none">
              {fmtGHS(room.pricePerNight)}
            </p>
            <p className="text-warm-gray text-[0.68rem] tracking-wider uppercase mt-0.5">per night</p>
          </div>
          <div className="text-right">
            <p className="flex items-center gap-1 text-warm-gray text-xs">
              <Users className="w-3 h-3" /> Up to {room.capacity}
            </p>
            {room.bedType && <p className="text-warm-gray text-[0.7rem] mt-0.5">{room.bedType} bed</p>}
          </div>
        </div>

        {room.description && (
          <p className="text-warm-gray text-xs leading-relaxed mb-3 line-clamp-2">{room.description}</p>
        )}

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {amenities.slice(0, 5).map((a, i) => {
              const Icon = ICONS[a]
              return (
                <span key={i} className="flex items-center gap-1 bg-cream border border-warm-border px-2 py-0.5 text-warm-gray text-[0.65rem]">
                  {Icon ? <Icon className="w-2.5 h-2.5" /> : <CheckCircle className="w-2.5 h-2.5" />}
                  {a}
                </span>
              )
            })}
          </div>
        )}

        <hr className="border-warm-border mb-4" />

        <div className="flex items-end justify-between">
          {estimate ? (
            <div>
              <p className="text-warm-gray text-[0.65rem] tracking-wider uppercase">{nights}n est.</p>
              <p className="font-[family-name:var(--font-playfair)] text-gold text-lg font-semibold leading-none">
                {fmtGHS(estimate)}
              </p>
            </div>
          ) : <div />}
          <button onClick={onEnquire} className="btn-gold text-[0.7rem] py-2.5 px-5">
            Enquire <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
