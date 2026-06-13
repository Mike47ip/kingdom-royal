// app/services/page.jsx
// kingdom-royal booking site

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Waves, Wine, BriefcaseBusiness,
  UtensilsCrossed, Sparkles,
  ArrowRight, Phone, Clock, Users, CheckCircle,
  PartyPopper, Smile
} from 'lucide-react'
import Navbar from '@/components/ui/Navbar'

const SERVICES = [
  {
    icon:  Waves,
    name:  'Swimming Pool',
    desc:  'Unwind in our temperature-controlled outdoor pool. Available daily for hotel guests.',
    hours: '6:00 AM – 10:00 PM',
    capacity: 'Up to 30 guests',
    image: '/assets/IMG_2024.jpg',
    highlights: ['Heated year-round', 'Pool-side service', 'Private cabanas available', 'Children welcome'],
    accent: '#3B82F6',
  },
  {
    icon:  Wine,
    name:  'Bar & Lounge',
    desc:  'Curated cocktails, fine wines, and premium spirits in an intimate setting. Perfect for unwinding after a long day.',
    hours: '4:00 PM – 1:00 AM',
    capacity: 'Seats 40',
    image: '/assets/IMG_2032.jpg',
    highlights: ['Premium cocktail menu', 'Live music weekends', 'Private VIP section', 'Cigar lounge'],
    accent: '#F59E0B',
  },
  {
    icon:  BriefcaseBusiness,
    name:  'Conference Rooms',
    desc:  'State-of-the-art meeting facilities equipped with the latest AV technology for corporate events of any scale.',
    hours: '7:00 AM – 9:00 PM',
    capacity: 'Up to 120 delegates',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    highlights: ['4K projection system', 'High-speed fibre WiFi', 'Catering service', 'Breakout rooms'],
    accent: '#6366F1',
  },
  {
    icon:  UtensilsCrossed,
    name:  'Restaurant',
    desc:  'An elevated dining experience featuring contemporary Ghanaian cuisine with international influences.',
    hours: '6:30 AM – 10:30 PM',
    capacity: 'Seats 80',
    image: '/assets/IMG_2037.jpg',
    highlights: ['Breakfast, lunch & dinner', 'Private dining room', 'Outdoor terrace', "Chef's tasting menu"],
    accent: '#F97316',
  },
  {
    icon:  PartyPopper,
    name:  'Event Center',
    desc:  'A grand, versatile event space ideal for weddings, corporate galas, banquets, and private celebrations.',
    hours: 'By reservation',
    capacity: 'Up to 500 guests',
    image: '/assets/IMG_2023.jpg',
    highlights: ['Full AV & lighting rig', 'Dedicated event coordinator', 'In-house catering', 'Customisable floor plans'],
    accent: '#C9A84C',
  },
  {
    icon:  Smile,
    name:  "Kids' Water Park",
    desc:  'A safe, fun-filled aquatic playground designed for children of all ages — slides, splash zones, and more.',
    hours: '9:00 AM – 6:00 PM',
    capacity: 'Up to 60 children',
    image: '/assets/IMG_2004.jpg',
    highlights: ['Age-appropriate slides', 'Lifeguards on duty', 'Shallow splash pool', 'Parent lounging area'],
    accent: '#10B981',
  },
]

export default function ServicesPage() {
  const router  = useRouter()
  const [active, setActive] = useState(null)

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar back="/" backLabel="Home" title="Kingdom Royal Palace Hotel">
        <button onClick={() => router.push('/my-booking')} className="btn-ghost-white text-[0.68rem]">
          Track Enquiry
        </button>
      </Navbar>

      {/* Hero band */}
      <section className="relative border-b border-gold/15 px-6 py-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/DJI_0215.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize: '38px 38px' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-gold-light text-[0.65rem] tracking-[0.2em] uppercase font-medium">World-Class Amenities</span>
          </div>
          <h1
            className="font-semibold text-white mb-4"
            style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.02em' }}
          >
            Services &amp; <span className="text-shimmer">Amenities</span>
          </h1>
          <p className="text-white/50 leading-relaxed font-light max-w-lg mx-auto" style={{ fontSize: 'clamp(0.9rem,2vw,1rem)' }}>
            Beyond exceptional rooms — Kingdom Royal Palace Hotel offers a complete luxury lifestyle experience with world-class facilities.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((svc, i) => {
            const Icon   = svc.icon
            const isOpen = active === i
            return (
              <div
                key={svc.name}
                className="animate-fade-up cursor-pointer group overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
                onClick={() => setActive(isOpen ? null : i)}
              >
                <div
                  className={`overflow-hidden border transition-all duration-300 ${
                    isOpen
                      ? 'border-gold/40 shadow-[0_0_30px_rgba(201,168,76,0.12)]'
                      : 'border-white/8 hover:border-gold/25'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={svc.image}
                      alt={svc.name}
                      fill
                      className={`object-cover transition-all duration-500 ${isOpen ? 'scale-105' : 'group-hover:scale-105'}`}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Icon + name on image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${svc.accent}30`, border: `1px solid ${svc.accent}60` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: svc.accent }} />
                      </div>
                      <h3
                        className="text-white font-semibold text-sm leading-tight"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        {svc.name}
                      </h3>
                    </div>

                    {/* Expand indicator */}
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white/70 text-sm">
                      {isOpen ? '−' : '+'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-charcoal-soft p-4">
                    <p className="text-white/45 text-xs leading-relaxed mb-3">{svc.desc}</p>

                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" style={{ color: svc.accent }} />
                        {svc.hours}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 shrink-0" style={{ color: svc.accent }} />
                        {svc.capacity}
                      </span>
                    </div>

                    {/* Expanded highlights */}
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-2 animate-fade-in">
                        {svc.highlights.map(h => (
                          <div key={h} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 shrink-0" style={{ color: svc.accent }} />
                            <span className="text-white/55 text-xs">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream border-t border-gold/15 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-2 mb-6">
            <Phone className="w-3 h-3 text-gold" />
            <span className="text-gold text-[0.65rem] tracking-[0.2em] uppercase font-medium">Get In Touch</span>
          </div>
          <h2
            className="text-charcoal font-semibold mb-4"
            style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.6rem,4vw,2.4rem)', letterSpacing: '-0.02em' }}
          >
            Ready to Book a Service?
          </h2>
          <p className="text-charcoal/70 text-sm leading-relaxed mb-8 max-w-lg mx-auto font-light">
            All service bookings are handled personally by our team. Browse a room and include your service preferences in the special requests.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => router.push('/')} className="btn-gold px-8 py-3.5 text-[0.75rem]">
              Book a Room <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => router.push('/my-booking')} className="btn-ghost px-8 py-3.5 text-[0.75rem]">
              Track My Enquiry
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}