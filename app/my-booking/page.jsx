'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search, Phone, Hash, CheckCircle, Clock, XCircle,
  AlertCircle, MessageSquare, BedDouble, Calendar, Users
} from 'lucide-react'
import { lookupEnquiry, cancelEnquiry } from '@/lib/api'
import Navbar from '@/components/ui/Navbar'
import StatusBadge from '@/components/ui/StatusBadge'

const fmtDate = d => !d ? '—' : new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtGHS  = n => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(n)

const STATUS_DESC = {
  PENDING:     'Your enquiry is awaiting review by the hotel team.',
  SEEN:        'The hotel team has viewed your enquiry and will be in touch soon.',
  NEGOTIATING: 'The hotel team is in contact with you to finalise details.',
  CONFIRMED:   'Your booking has been confirmed! Check the details below.',
  REJECTED:    'Unfortunately the hotel could not accommodate your request.',
  CANCELLED:   'This enquiry has been cancelled.',
}

const STATUS_ICON = {
  PENDING:     Clock,
  SEEN:        Search,
  NEGOTIATING: MessageSquare,
  CONFIRMED:   CheckCircle,
  REJECTED:    XCircle,
  CANCELLED:   XCircle,
}

export default function MyBookingPage() {
  const router = useRouter()
  const sp     = useSearchParams()

  const [phone,      setPhone]      = useState(sp.get('phone') ? decodeURIComponent(sp.get('phone')) : '')
  const [refNum,     setRefNum]     = useState(sp.get('enquiryNumber') || '')
  const [enquiry,    setEnquiry]    = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelErr,  setCancelErr]  = useState(null)
  const [cancelled,  setCancelled]  = useState(false)

  useEffect(() => {
    if (sp.get('enquiryNumber') && sp.get('phone')) handleLookup()
  }, [])

  async function handleLookup(e) {
    if (e) e.preventDefault()
    if (!phone || !refNum) { setError('Both fields are required.'); return }
    setLoading(true); setError(null); setEnquiry(null)
    try {
      const data = await lookupEnquiry(phone, refNum)
      setEnquiry(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!enquiry || !confirm('Are you sure you want to cancel this enquiry?')) return
    setCancelling(true); setCancelErr(null)
    try {
      await cancelEnquiry(enquiry.id, phone)
      setCancelled(true)
      setEnquiry(prev => ({ ...prev, status: 'CANCELLED' }))
    } catch (err) {
      setCancelErr(err.message)
    } finally {
      setCancelling(false)
    }
  }

  const Icon = enquiry ? (STATUS_ICON[enquiry.status] || Clock) : null

  return (
    <div className="min-h-screen bg-cream">
      <Navbar back="/" backLabel="Hotels" title="Track My Enquiry" />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10 animate-fade-up">
          <h1
            className="font-[family-name:var(--font-playfair)] text-charcoal font-normal leading-tight mb-2"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
          >
            Track Your Enquiry
          </h1>
          <p className="text-warm-gray text-sm leading-relaxed">
            Enter your phone number and enquiry reference to view the status of your booking request.
          </p>
        </div>

        {/* Lookup form */}
        <form onSubmit={handleLookup} className="bg-white p-6 shadow-[0_2px_16px_rgba(26,26,26,0.06)] mb-6">
          <div className="space-y-4">
            <div>
              <label className="label-field">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
                <input type="tel" className="input-field pl-9" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233 XX XXX XXXX" />
              </div>
            </div>
            <div>
              <label className="label-field">Enquiry Reference</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray pointer-events-none" />
                <input
                  className="input-field pl-9 uppercase tracking-widest"
                  value={refNum}
                  onChange={e => setRefNum(e.target.value.toUpperCase())}
                  placeholder="ENQ-XXXXXXX-XXXX"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <button type="submit" className="btn-gold w-full py-3 text-[0.75rem]" disabled={loading}>
              {loading ? 'Looking up...' : <><Search className="w-3.5 h-3.5" /> Find My Enquiry</>}
            </button>
          </div>
        </form>

        {/* Result */}
        {enquiry && (
          <div className="space-y-4 animate-fade-in">

            {/* Status banner */}
            <div className="bg-charcoal p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/12 border border-gold/30 flex items-center justify-center shrink-0">
                {Icon && <Icon className="w-5 h-5 text-gold" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1.5">
                  <span className="font-[family-name:var(--font-playfair)] text-white text-base">{enquiry.enquiryNumber}</span>
                  <StatusBadge status={enquiry.status} />
                </div>
                <p className="text-white/45 text-xs leading-relaxed">{STATUS_DESC[enquiry.status]}</p>
              </div>
            </div>

            {/* Admin message */}
            {enquiry.adminNotes && (
              <div className="bg-white border-l-4 border-gold p-5 shadow-[0_2px_16px_rgba(26,26,26,0.06)]">
                <p className="text-gold text-[0.62rem] tracking-[0.15em] uppercase mb-2">Message from Hotel</p>
                <p className="text-charcoal text-sm leading-relaxed">{enquiry.adminNotes}</p>
              </div>
            )}

            {/* Rejection reason */}
            {enquiry.rejectionReason && (
              <div className="bg-red-50 border-l-4 border-red-500 p-5">
                <p className="text-red-700 text-[0.62rem] tracking-[0.15em] uppercase mb-2">Reason</p>
                <p className="text-red-800 text-sm leading-relaxed">{enquiry.rejectionReason}</p>
              </div>
            )}

            {/* Confirmed booking */}
            {enquiry.booking && (
              <div className="bg-green-50 border-l-4 border-green-500 p-5">
                <p className="text-green-700 text-[0.62rem] tracking-[0.15em] uppercase mb-3">Booking Confirmed</p>
                <div className="flex flex-wrap gap-5">
                  <div>
                    <span className="text-green-600 text-xs">Booking #: </span>
                    <span className="text-green-800 text-xs font-semibold">{enquiry.booking.bookingNumber}</span>
                  </div>
                  <div>
                    <span className="text-green-600 text-xs">Amount: </span>
                    <span className="text-green-800 text-xs font-semibold">{fmtGHS(enquiry.booking.finalAmount)}</span>
                  </div>
                </div>
                <p className="text-green-600 text-xs mt-2">Payment due at hotel. Present your booking number upon arrival.</p>
              </div>
            )}

            {/* Enquiry details */}
            <div className="bg-white p-5 shadow-[0_2px_16px_rgba(26,26,26,0.06)]">
              <h3 className="font-[family-name:var(--font-playfair)] text-base text-charcoal font-semibold mb-4">Enquiry Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BedDouble, label: 'Room',      value: enquiry.room ? `Room ${enquiry.room.roomNumber} · ${enquiry.room.roomType}` : (enquiry.roomType || 'Any available') },
                  { icon: Users,     label: 'Guests',    value: `${enquiry.numberOfGuests} guest${enquiry.numberOfGuests > 1 ? 's' : ''}` },
                  { icon: Calendar,  label: 'Check-in',  value: fmtDate(enquiry.checkInDate) },
                  { icon: Calendar,  label: 'Check-out', value: fmtDate(enquiry.checkOutDate) },
                ].map(({ icon: ItemIcon, label, value }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <ItemIcon className="w-3 h-3 text-gold" />
                      <span className="text-warm-gray text-[0.62rem] uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-charcoal text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {enquiry.specialRequests && (
                <div className="mt-4 pt-4 border-t border-warm-border">
                  <p className="text-warm-gray text-[0.62rem] uppercase tracking-wider mb-1.5">Special Requests</p>
                  <p className="text-charcoal text-sm leading-relaxed">{enquiry.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Hotel contact */}
            {enquiry.hotel && (
              <div className="bg-white p-5 shadow-[0_2px_16px_rgba(26,26,26,0.06)]">
                <p className="text-warm-gray text-[0.62rem] uppercase tracking-wider mb-3">Hotel Contact</p>
                <p className="font-[family-name:var(--font-playfair)] text-charcoal text-base mb-2">{enquiry.hotel.name}</p>
                {enquiry.hotel.phone && (
                  <a href={`tel:${enquiry.hotel.phone}`} className="inline-flex items-center gap-2 text-gold text-sm hover:text-gold-dark transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {enquiry.hotel.phone}
                  </a>
                )}
              </div>
            )}

            {/* Cancel */}
            {!['CONFIRMED', 'REJECTED', 'CANCELLED'].includes(enquiry.status) && !cancelled && (
              <div className="bg-white p-5 shadow-[0_2px_16px_rgba(26,26,26,0.06)]">
                {cancelErr && (
                  <div className="bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-xs mb-3">{cancelErr}</div>
                )}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-charcoal text-sm font-medium">Cancel this enquiry</p>
                    <p className="text-warm-gray text-xs mt-0.5">This cannot be undone.</p>
                  </div>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-xs tracking-wide uppercase px-5 py-2 bg-transparent cursor-pointer disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Enquiry'}
                  </button>
                </div>
              </div>
            )}

            {cancelled && (
              <div className="bg-gray-100 px-5 py-4 text-center text-charcoal text-sm">
                Enquiry cancelled.{' '}
                <button onClick={() => router.push('/')} className="text-gold bg-transparent border-0 cursor-pointer text-sm hover:text-gold-dark">
                  Browse Hotels →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
