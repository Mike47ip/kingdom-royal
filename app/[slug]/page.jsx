// app/[slug]/page.jsx  ← ROOMS LISTING PAGE

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  Calendar, Users, Wifi, Wind, Tv, CheckCircle,
  RefreshCw, BedDouble, ArrowRight, MapPin, Phone,
  Star, Eye, Lock, AlertCircle
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
const TYPE_ORDER = ['STANDARD','DELUXE','SUITE','EXECUTIVE','PRESIDENTIAL']

const STATUS_CONFIG = {
  AVAILABLE:      { label: 'Available',      available: true,  badge: 'bg-green-100 text-green-800'   },
  CLEANING:       { label: 'Available Soon', available: true,  badge: 'bg-blue-100 text-blue-800'     },
  OCCUPIED:       { label: 'Occupied',       available: false, badge: 'bg-red-100 text-red-800'       },
  RESERVED:       { label: 'Reserved',       available: false, badge: 'bg-yellow-100 text-yellow-800' },
  MAINTENANCE:    { label: 'Maintenance',    available: false, badge: 'bg-orange-100 text-orange-800' },
  OUT_OF_SERVICE: { label: 'Unavailable',    available: false, badge: 'bg-gray-100 text-gray-600'     },
}

const today    = () => new Date().toISOString().split('T')[0]
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0] }
const fmtGHS   = n => new Intl.NumberFormat('en-GH', { style:'currency', currency:'GHS' }).format(n)
const nights   = (a,b) => (!a || !b) ? 0 : Math.max(0, Math.ceil((new Date(b)-new Date(a))/86400000))

export default function HotelRoomsPage() {
  const router   = useRouter()
  const { slug } = useParams()

  const [hotel,       setHotel]       = useState(null)
  const [rooms,       setRooms]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [refreshing,  setRefreshing]  = useState(false)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [checkIn,     setCheckIn]     = useState(today())
  const [checkOut,    setCheckOut]    = useState(tomorrow())
  const [guests,      setGuests]      = useState(1)
  const [lightbox,    setLightbox]    = useState(null) // { images, index }
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

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return
    const fn = e => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(p => ({ ...p, index: (p.index+1) % p.images.length }))
      if (e.key === 'ArrowLeft')  setLightbox(p => ({ ...p, index: (p.index-1+p.images.length) % p.images.length }))
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightbox])

  const nightCount = nights(checkIn, checkOut)

  // Group by type, all rooms (available + unavailable)
  const byType = TYPE_ORDER.reduce((acc, t) => {
    const list = rooms.filter(r => r.roomType === t && r.capacity >= guests)
    if (list.length) acc[t] = list
    return acc
  }, {})

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar back="/" backLabel="All Hotels" title="Kingdom Royal" />
      <Spinner label="Loading rooms..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <Navbar back="/" backLabel="All Hotels" title={hotel?.name || 'Kingdom Royal'}>
        {refreshing && (
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <RefreshCw className="w-3 h-3 animate-spin-slow" /> Updating
          </span>
        )}
        <button onClick={() => router.push('/my-booking')} className="btn-ghost-white text-[0.68rem]">
          My Enquiry
        </button>
      </Navbar>

      {/* Hotel header */}
      {hotel && (
        <div className="bg-charcoal-soft border-b border-gold/20 px-6 py-7">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="font-semibold text-white font-normal leading-tight mb-2"
                style={{ fontFamily:'var(--font-outfit)', fontSize:'clamp(1.4rem,3vw,2rem)', letterSpacing:'-0.01em' }}
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
              {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
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
                type="date" value={checkIn} min={today()}
                onChange={e => {
                  setCheckIn(e.target.value)
                  if (e.target.value >= checkOut) {
                    const d = new Date(e.target.value); d.setDate(d.getDate()+1)
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
                type="date" value={checkOut} min={checkIn || today()}
                onChange={e => setCheckOut(e.target.value)}
                className="input-field pl-9 w-40 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="label-field">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
              <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="input-field pl-9 w-32 text-sm">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
              </select>
            </div>
          </div>
          <div className="ml-auto text-right">
            {nightCount > 0 && <p className="text-warm-gray text-xs mb-0.5">{nightCount} night{nightCount>1?'s':''}</p>}
            {lastUpdated && (
              <p className="text-warm-gray text-[0.68rem] opacity-50">
                Updated {lastUpdated.toLocaleTimeString('en-GH',{hour:'2-digit',minute:'2-digit'})}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Room listings */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {error && <div className="bg-red-50 border border-red-200 px-5 py-3 text-red-700 text-sm mb-6">{error}</div>}

        {Object.keys(byType).length === 0 && !error && (
          <div className="text-center py-20">
            <BedDouble className="w-10 h-10 text-warm-border mx-auto mb-4" />
            <p className="text-2xl text-charcoal mb-2 font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>No rooms found</p>
            <p className="text-warm-gray text-sm">Try different dates or fewer guests</p>
          </div>
        )}

        {Object.entries(byType).map(([type, list]) => (
          <div key={type} className="mb-14">
            <div className="flex items-center gap-4 mb-5">
              <h2 className="font-semibold text-charcoal whitespace-nowrap" style={{ fontFamily:'var(--font-outfit)', fontSize:'1.4rem', letterSpacing:'-0.01em' }}>
                {TYPE_LABELS[type]}
              </h2>
              <div className="flex-1 h-px bg-warm-border" />
              <span className="text-warm-gray text-xs whitespace-nowrap">
                {list.filter(r => STATUS_CONFIG[r.status]?.available).length} of {list.length} available
              </span>
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))' }}>
              {list.map((room, i) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  nights={nightCount}
                  delay={i * 0.04}
                  onEnquire={() => router.push(`/${slug}/book?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                  onViewImage={(images, index) => setLightbox({ images, index })}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={lightbox.images[lightbox.index]}
              alt="Room"
              width={1200}
              height={800}
              className="w-full max-h-[80vh] object-contain"
            />
            <button onClick={() => setLightbox(null)} className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-lg border-0 cursor-pointer">✕</button>
            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={() => setLightbox(p => ({ ...p, index: (p.index-1+p.images.length)%p.images.length }))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 rounded-full w-9 h-9 flex items-center justify-center border-0 cursor-pointer text-lg"
                >‹</button>
                <button
                  onClick={() => setLightbox(p => ({ ...p, index: (p.index+1)%p.images.length }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 rounded-full w-9 h-9 flex items-center justify-center border-0 cursor-pointer text-lg"
                >›</button>
                <p className="text-center text-white/50 text-xs mt-3">{lightbox.index+1} / {lightbox.images.length}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function RoomCard({ room, nights, delay, onEnquire, onViewImage }) {
  const amenities = Array.isArray(room.amenities) ? room.amenities : []
  const images    = Array.isArray(room.images) ? room.images : []
  const estimate  = nights > 0 ? room.pricePerNight * nights : null
  const ICONS     = { WiFi: Wifi, AC: Wind, TV: Tv }
  const status    = STATUS_CONFIG[room.status] || STATUS_CONFIG.AVAILABLE
  const isAvailable = status.available

  return (
    <div
      className={`animate-fade-up overflow-hidden transition-all duration-300 ${
        isAvailable
          ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] hover:-translate-y-1'
          : 'bg-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.05)]'
      }`}
      style={{ animationDelay:`${delay}s`, opacity:0 }}
    >
      {/* Image */}
      <div className="relative h-48 bg-charcoal-soft overflow-hidden">
        {images.length > 0 ? (
          <>
            <Image
              src={images[0]}
              alt={`Room ${room.roomNumber}`}
              fill
              className={`object-cover transition-all duration-300 ${!isAvailable ? 'grayscale opacity-60' : 'group-hover:scale-105'}`}
            />
            {images.length > 1 && (
              <button
                onClick={() => onViewImage(images, 0)}
                className="absolute bottom-2 right-2 bg-black/60 text-white text-[0.62rem] px-2 py-1 flex items-center gap-1 border-0 cursor-pointer hover:bg-black/80 transition-colors"
              >
                <Eye className="w-3 h-3" /> {images.length} photos
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{ backgroundImage:'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize:'20px 20px' }}
            />
            <BedDouble className={`w-10 h-10 mb-2 ${isAvailable ? 'text-gold/50' : 'text-gray-300'}`} />
            <span className="text-white/30 text-[0.65rem] tracking-widest uppercase">Room {room.roomNumber}</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`text-[0.6rem] px-2.5 py-1 font-semibold tracking-wider uppercase ${status.badge}`}>
            {status.label}
          </span>
        </div>

        {/* Feature tags */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {room.hasBalcony && (
            <span className="bg-gold/90 text-white text-[0.58rem] px-2 py-0.5 tracking-wide uppercase">Balcony</span>
          )}
          {room.hasSeaView && (
            <span className="bg-blue-500/85 text-white text-[0.58rem] px-2 py-0.5 tracking-wide uppercase">Sea View</span>
          )}
        </div>

        {/* Unavailable overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
            <div className="bg-white/90 px-3 py-1.5 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-warm-gray" />
              <span className="text-warm-gray text-xs font-medium">{status.label}</span>
            </div>
          </div>
        )}
      </div>

      <div className={`p-5 ${!isAvailable ? 'opacity-70' : ''}`}>
        {/* Price + capacity */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className={`text-2xl font-semibold leading-none ${isAvailable ? 'text-charcoal' : 'text-warm-gray'}`} style={{ fontFamily:'var(--font-outfit)' }}>
              {fmtGHS(room.pricePerNight)}
            </p>
            <p className="text-warm-gray text-[0.68rem] tracking-wider uppercase mt-0.5">per night</p>
          </div>
          <div className="text-right">
            <p className="flex items-center gap-1 text-warm-gray text-xs justify-end">
              <Users className="w-3 h-3" /> Up to {room.capacity}
            </p>
            {room.bedType && <p className="text-warm-gray text-[0.7rem] mt-0.5">{room.bedType} bed</p>}
            <p className="text-warm-gray text-[0.7rem] mt-0.5">Floor {room.floor}</p>
          </div>
        </div>

        {room.description && (
          <p className="text-warm-gray text-xs leading-relaxed mb-3 line-clamp-2">{room.description}</p>
        )}

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {amenities.slice(0,5).map((a,i) => {
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

        {/* Image thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            {images.slice(0,4).map((img, i) => (
              <button key={i} onClick={() => onViewImage(images, i)} className="shrink-0 w-12 h-10 border-0 p-0 cursor-pointer overflow-hidden">
                <Image src={img} alt="" width={48} height={40} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
              </button>
            ))}
            {images.length > 4 && (
              <button onClick={() => onViewImage(images, 4)} className="shrink-0 w-12 h-10 bg-charcoal flex items-center justify-center text-white/60 text-xs border-0 cursor-pointer hover:bg-charcoal-soft transition-colors">
                +{images.length-4}
              </button>
            )}
          </div>
        )}

        <hr className="border-warm-border mb-4" />

        <div className="flex items-end justify-between">
          {estimate && isAvailable ? (
            <div>
              <p className="text-warm-gray text-[0.65rem] tracking-wider uppercase">{nights}n est.</p>
              <p className="text-gold text-lg font-semibold leading-none" style={{ fontFamily:'var(--font-outfit)' }}>{fmtGHS(estimate)}</p>
            </div>
          ) : <div />}

          {isAvailable ? (
            <button onClick={onEnquire} className="btn-gold text-[0.7rem] py-2.5 px-5">
              Enquire <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={onEnquire}
              className="btn-outline text-[0.7rem] py-2.5 px-5 opacity-60"
            >
              <AlertCircle className="w-3 h-3" /> Enquire Anyway
            </button>
          )}
        </div>
      </div>
    </div>
  )
}