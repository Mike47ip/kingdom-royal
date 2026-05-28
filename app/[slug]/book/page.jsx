// app/[slug]/book/page.jsx  ← ENQUIRY FORM — white bg, Outfit font, fixed nav

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  User, Phone, Mail, Calendar, Users,
  MessageSquare, BedDouble, CheckCircle, Lock
} from 'lucide-react'
import { getRooms, submitEnquiry } from '@/lib/api'
import Navbar from '@/components/ui/Navbar'
import Spinner from '@/components/ui/Spinner'

const fmtGHS  = n => new Intl.NumberFormat('en-GH', { style:'currency', currency:'GHS' }).format(n)
const fmtDate = d => !d ? '' : new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
const nights  = (a,b) => (!a || !b) ? 0 : Math.max(0, Math.ceil((new Date(b)-new Date(a))/86400000))

export default function BookPage() {
  const router   = useRouter()
  const { slug } = useParams()
  const sp       = useSearchParams()
  const roomId   = sp.get('roomId')
  const checkIn  = sp.get('checkIn')
  const checkOut = sp.get('checkOut')
  const guests   = Number(sp.get('guests') || 1)

  const [room,       setRoom]       = useState(null)
  const [hotel,      setHotel]      = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)
  const [form, setForm] = useState({
    firstName:'', lastName:'', phone:'', email:'',
    numberOfGuests: guests, specialRequests:''
  })

  useEffect(() => {
    getRooms(slug, checkIn, checkOut)
      .then(data => {
        setHotel(data.hotel)
        if (roomId) setRoom(data.rooms.find(r => r.id === roomId) || null)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug, roomId, checkIn, checkOut])

  const nightCount = nights(checkIn, checkOut)
  const estimate   = room ? room.pricePerNight * Math.max(1, nightCount) : 0
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const images = Array.isArray(room?.images) ? room.images : []

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.phone) {
      setError('First name, last name and phone are required.')
      return
    }
    setError(null); setSubmitting(true)
    try {
      const result = await submitEnquiry({
        slug, ...form, roomId,
        roomType: room?.roomType,
        checkInDate: checkIn, checkOutDate: checkOut,
        numberOfGuests: form.numberOfGuests,
      })
      router.push(`/${slug}/book/confirm?enquiryNumber=${result.enquiryNumber}&phone=${encodeURIComponent(form.phone)}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar back={`/${slug}`} backLabel="Back to Rooms" title={hotel?.name || 'Kingdom Royal'} />
      <Spinner label="Loading room details..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      {/* Fixed: back goes to /${slug} which is the rooms listing page */}
      <Navbar back={`/${slug}`} backLabel="Back to Rooms" title={hotel?.name || 'Kingdom Royal'} />

      {/* Page header — white bg, warm border bottom */}
      <div className="bg-white border-b border-warm-border px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-[0.65rem] tracking-[0.2em] uppercase mb-2 font-semibold">Booking Enquiry</p>
          <h1
            className="text-charcoal font-semibold leading-tight"
            style={{ fontFamily:'var(--font-outfit)', fontSize:'clamp(1.5rem,3vw,2.2rem)', letterSpacing:'-0.02em' }}
          >
            Submit Your Enquiry
          </h1>
          <p className="text-warm-gray text-sm mt-2">
            Our team will review your request and contact you to confirm your reservation.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── FORM ─────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Personal details */}
            <div className="bg-white p-6 shadow-[0_2px_16px_rgba(26,26,26,0.06)]">
              <h2 className="font-semibold text-charcoal mb-5 flex items-center gap-2 text-base" style={{ fontFamily:'var(--font-outfit)' }}>
                <User className="w-4 h-4 text-gold" /> Your Details
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label-field">First Name *</label>
                  <input className="input-field" value={form.firstName} onChange={set('firstName')} placeholder="John" required />
                </div>
                <div>
                  <label className="label-field">Last Name *</label>
                  <input className="input-field" value={form.lastName} onChange={set('lastName')} placeholder="Doe" required />
                </div>
              </div>
              <div className="mb-4">
                <label className="label-field">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
                  <input type="tel" className="input-field pl-9" value={form.phone} onChange={set('phone')} placeholder="+233 XX XXX XXXX" required />
                </div>
                <p className="text-warm-gray text-[0.7rem] mt-1.5">We'll use this to contact you and look up your enquiry.</p>
              </div>
              <div>
                <label className="label-field">Email (optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
                  <input type="email" className="input-field pl-9" value={form.email} onChange={set('email')} placeholder="john@example.com" />
                </div>
              </div>
            </div>

            {/* Stay details */}
            <div className="bg-white p-6 shadow-[0_2px_16px_rgba(26,26,26,0.06)]">
              <h2 className="font-semibold text-charcoal mb-5 flex items-center gap-2 text-base" style={{ fontFamily:'var(--font-outfit)' }}>
                <Calendar className="w-4 h-4 text-gold" /> Stay Details
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[['Check-in', checkIn], ['Check-out', checkOut]].map(([label, val]) => (
                  <div key={label}>
                    <label className="label-field">{label}</label>
                    <div className="px-4 py-3 border border-warm-border bg-cream text-charcoal text-sm">{fmtDate(val)}</div>
                  </div>
                ))}
              </div>
              <div>
                <label className="label-field">Number of Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
                  <select className="input-field pl-9" value={form.numberOfGuests} onChange={set('numberOfGuests')}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Special requests */}
            <div className="bg-white p-6 shadow-[0_2px_16px_rgba(26,26,26,0.06)]">
              <h2 className="font-semibold text-charcoal mb-5 flex items-center gap-2 text-base" style={{ fontFamily:'var(--font-outfit)' }}>
                <MessageSquare className="w-4 h-4 text-gold" /> Special Requests
              </h2>
              <textarea
                className="input-field min-h-24 resize-y leading-relaxed"
                value={form.specialRequests}
                onChange={set('specialRequests')}
                placeholder="Any preferences, service bookings (pool, conference, spa), or special requests..."
              />
              <p className="text-warm-gray text-[0.7rem] mt-2">Mention any services (Bar, Pool, Spa etc.) you'd like with your stay.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">{error}</div>
            )}

            <button type="submit" className="btn-gold w-full py-4 text-[0.78rem]" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Enquiry →'}
            </button>

            <div className="flex items-center justify-center gap-2 text-warm-gray text-xs">
              <Lock className="w-3 h-3" />
              No payment required — our team confirms everything personally.
            </div>
          </form>

          {/* ── SUMMARY SIDEBAR ──────────────────────────── */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white shadow-[0_4px_24px_rgba(26,26,26,0.08)] p-6">
              <p className="text-warm-gray text-[0.65rem] tracking-[0.15em] uppercase mb-4">Enquiry Summary</p>

              {room ? (
                <>
                  {/* Room image */}
                  {images.length > 0 ? (
                    <div className="relative h-32 mb-4 overflow-hidden">
                      <Image src={images[0]} alt={`Room ${room.roomNumber}`} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-24 bg-charcoal-soft mb-4 flex items-center justify-center">
                      <BedDouble className="w-8 h-8 text-gold/40" />
                    </div>
                  )}

                  <div className="bg-cream border border-warm-border p-3 mb-5">
                    <p className="text-charcoal text-sm font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Room {room.roomNumber}</p>
                    <p className="text-warm-gray text-xs">{room.roomType?.replace('_',' ')} · {room.bedType} bed · Floor {room.floor}</p>
                  </div>

                  <div className="space-y-2 mb-5">
                    {[
                      { label:'Check-in',  value: fmtDate(checkIn)  },
                      { label:'Check-out', value: fmtDate(checkOut) },
                      { label:'Duration',  value: `${nightCount} night${nightCount!==1?'s':''}` },
                      { label:'Guests',    value: `${form.numberOfGuests} guest${form.numberOfGuests>1?'s':''}` },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-2 border-b border-warm-border">
                        <span className="text-warm-gray text-xs">{row.label}</span>
                        <span className="text-charcoal text-xs font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-cream border border-warm-border p-4 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-warm-gray text-xs">Estimated Total</span>
                      <span className="text-gold text-xl font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>{fmtGHS(estimate)}</span>
                    </div>
                    <p className="text-warm-gray text-[0.68rem] mt-1.5">Final price confirmed by our team. Payment at hotel.</p>
                  </div>
                </>
              ) : (
                <p className="text-warm-gray text-sm mb-5">General availability enquiry.</p>
              )}

              <hr className="divider-gold my-5" />

              <div className="space-y-2.5">
                {['No payment now — pay at hotel','Team contacts you to confirm','Cancel enquiry anytime'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-gold shrink-0" />
                    <span className="text-warm-gray text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}