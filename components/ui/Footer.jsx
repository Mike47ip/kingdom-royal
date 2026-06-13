// components/ui/Footer.jsx
'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const router = useRouter()

  return (
    <footer>

      {/* ── TOP CTA BAND ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-t-[48px] md:rounded-t-[72px]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/DJI_0237.jpg')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/72" />
        {/* Gold dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Top gold line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

            {/* Left — headline + copy */}
            <div className="md:max-w-[52%]">
              <p className="text-gold text-[0.65rem] tracking-[0.22em] uppercase font-semibold mb-4">
                Reserve Your Stay
              </p>
              <h2
                className="text-white font-semibold leading-[1.08] mb-5"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Experience Luxury<br />
                <span style={{ color: '#C9A84C' }}>in the Heart of Ghana.</span>
              </h2>
              <p className="text-white/45 text-sm leading-relaxed max-w-md font-light">
                Submit your enquiry today and our team will personally confirm
                your room, dates, and any special arrangements — within 24 hours.
              </p>
            </div>

            {/* Right — CTA buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
              <button
                onClick={() => router.push('/')}
                className="btn-gold px-7 py-3.5 text-[0.75rem] whitespace-nowrap"
              >
                Browse Rooms <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => router.push('/services')}
                className="btn-ghost-white px-7 py-3.5 text-[0.75rem] whitespace-nowrap"
              >
                Our Services
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM STRIP ─────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border-t border-gold/10 pt-12 pb-8 px-6">
        <div className="max-w-6xl mx-auto">

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="lg:col-span-1">
              <p
                className="text-gold text-xl font-semibold mb-1"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Kingdom Royal
              </p>
              <p className="text-white/25 text-[0.6rem] tracking-[0.25em] uppercase mb-5">
                Luxury Hotels · Ghana
              </p>
              <p className="text-white/35 text-xs leading-relaxed">
                Exceptional rooms, world-class amenities, and personalised
                service — crafted for the discerning traveller.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white/50 text-[0.62rem] tracking-[0.22em] uppercase font-semibold mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Browse Rooms',   path: '/'           },
                  { label: 'Our Services',   path: '/services'   },
                  { label: 'Track Enquiry',  path: '/my-booking' },
                ].map(({ label, path }) => (
                  <li key={label}>
                    <button
                      onClick={() => router.push(path)}
                      className="text-white/40 hover:text-gold text-xs transition-colors duration-200 bg-transparent border-0 cursor-pointer p-0 text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white/50 text-[0.62rem] tracking-[0.22em] uppercase font-semibold mb-5">
                Amenities
              </h4>
              <ul className="space-y-3">
                {['Swimming Pool', 'Bar & Lounge', 'Conference Rooms', 'Restaurant', 'Event Center', "Kids' Water Park"].map(s => (
                  <li key={s}>
                    <button
                      onClick={() => router.push('/services')}
                      className="text-white/40 hover:text-gold text-xs transition-colors duration-200 bg-transparent border-0 cursor-pointer p-0 text-left"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white/50 text-[0.62rem] tracking-[0.22em] uppercase font-semibold mb-5">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-2.5 text-white/40 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  Kumasi, Ashanti Region, Ghana
                </li>
                <li className="flex items-center gap-2.5 text-white/40 text-xs">
                  <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                  +233 XX XXX XXXX
                </li>
                <li className="flex items-center gap-2.5 text-white/40 text-xs">
                  <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                  info@kingdomroyal.com
                </li>
              </ul>
            </div>

          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-7" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/20 text-[0.65rem] tracking-wide">
            <p>© {new Date().getFullYear()} Kingdom Royal Hotels. All rights reserved.</p>
            <p>For confirmed bookings, our team will contact you directly.</p>
          </div>

        </div>
      </div>

    </footer>
  )
}