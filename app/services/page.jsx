'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Waves, Wine, BriefcaseBusiness, Dumbbell,
  UtensilsCrossed, Car, Sparkles, Shirt,
  ArrowRight, Phone, Mail, Clock, Users,
  CheckCircle, ArrowLeft
} from 'lucide-react'
import Navbar from '@/components/ui/Navbar'

const SERVICES = [
  {
    icon:  Waves,
    name:  'Swimming Pool',
    desc:  'Unwind in our temperature-controlled outdoor pool. Available daily from 6am to 10pm for hotel guests.',
    hours: '6:00 AM – 10:00 PM',
    capacity: 'Up to 30 guests',
    highlights: ['Heated year-round','Pool-side service','Private cabanas available','Children welcome'],
    color: 'from-blue-900/60 to-blue-800/40',
    accent: '#3B82F6',
  },
  {
    icon:  Wine,
    name:  'Bar & Lounge',
    desc:  'Curated cocktails, fine wines, and premium spirits in an intimate setting. Perfect for unwinding after a long day.',
    hours: '4:00 PM – 1:00 AM',
    capacity: 'Seats 40',
    highlights: ['Premium cocktail menu','Live music weekends','Private VIP section','Cigar lounge'],
    color: 'from-amber-900/60 to-amber-800/40',
    accent: '#F59E0B',
  },
  {
    icon:  BriefcaseBusiness,
    name:  'Conference Rooms',
    desc:  'State-of-the-art meeting facilities equipped with the latest AV technology for corporate events of any scale.',
    hours: '7:00 AM – 9:00 PM',
    capacity: 'Up to 120 delegates',
    highlights: ['4K projection system','High-speed fibre WiFi','Catering service','Breakout rooms'],
    color: 'from-slate-900/60 to-slate-800/40',
    accent: '#6366F1',
  },
  {
    icon:  Dumbbell,
    name:  'Gym & Fitness',
    desc:  'Fully equipped fitness centre with modern cardio and strength training equipment. Personal trainers available.',
    hours: '5:00 AM – 11:00 PM',
    capacity: 'Up to 20 guests',
    highlights: ['Latest Technogym equipment','Personal trainer on request','Sauna & steam room','Yoga classes'],
    color: 'from-green-900/60 to-green-800/40',
    accent: '#10B981',
  },
  {
    icon:  UtensilsCrossed,
    name:  'Restaurant',
    desc:  'An elevated dining experience featuring contemporary Ghanaian cuisine with international influences.',
    hours: '6:30 AM – 10:30 PM',
    capacity: 'Seats 80',
    highlights: ['Breakfast, lunch & dinner','Private dining room','Outdoor terrace','Chef\'s tasting menu'],
    color: 'from-orange-900/60 to-orange-800/40',
    accent: '#F97316',
  },
  {
    icon:  Car,
    name:  'Airport Transport',
    desc:  'Seamless transfers between Kumasi Airport and the hotel in our luxury fleet. Available around the clock.',
    hours: '24 hours',
    capacity: 'Fleet of 6 vehicles',
    highlights: ['Luxury fleet','Meet & greet service','City tours available','Corporate accounts'],
    color: 'from-zinc-900/60 to-zinc-800/40',
    accent: '#C9A84C',
  },
  {
    icon:  Shirt,
    name:  'Laundry & Valet',
    desc:  'Same-day laundry, dry cleaning, and valet pressing to keep you looking your best throughout your stay.',
    hours: '7:00 AM – 8:00 PM',
    capacity: 'Same-day service',
    highlights: ['Same-day turnaround','Dry cleaning','Shoe shine service','Express pressing'],
    color: 'from-purple-900/60 to-purple-800/40',
    accent: '#A855F7',
  },
  {
    icon:  Sparkles,
    name:  'Spa & Wellness',
    desc:  'Restorative treatments and therapies designed to rejuvenate body and mind using premium products.',
    hours: '9:00 AM – 8:00 PM',
    capacity: '6 treatment rooms',
    highlights: ['Full-body massages','Facial treatments','Couples packages','Aromatherapy'],
    color: 'from-rose-900/60 to-rose-800/40',
    accent: '#EC4899',
  },
]

export default function ServicesPage() {
  const router  = useRouter()
  const [active, setActive] = useState(null)

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar back="/" backLabel="Home" title="Kingdom Royal">
        <button onClick={() => router.push('/my-booking')} className="btn-ghost-white text-[0.68rem]">
          Track Enquiry
        </button>
      </Navbar>

      {/* Hero band */}
      <section className="relative bg-charcoal-soft border-b border-gold/15 px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage:'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize:'38px 38px' }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-gold-light text-[0.65rem] tracking-[0.2em] uppercase font-medium">World-Class Amenities</span>
          </div>
          <h1
            className="font-semibold text-white mb-4"
            style={{ fontFamily:'var(--font-outfit)', fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.02em' }}
          >
            Services &amp; <span className="text-shimmer">Amenities</span>
          </h1>
          <p className="text-white/50 leading-relaxed font-light max-w-lg mx-auto" style={{ fontSize:'clamp(0.9rem,2vw,1rem)' }}>
            Beyond exceptional rooms — Kingdom Royal offers a complete luxury lifestyle experience with world-class facilities and personalised service.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon
            const isOpen = active === i
            return (
              <div
                key={svc.name}
                className="animate-fade-up cursor-pointer group"
                style={{ animationDelay:`${i * 0.05}s`, opacity:0 }}
                onClick={() => setActive(isOpen ? null : i)}
              >
                <div
                  className={`relative overflow-hidden border transition-all duration-300 ${
                    isOpen
                      ? 'border-gold/40 bg-charcoal-soft shadow-[0_0_30px_rgba(201,168,76,0.12)]'
                      : 'border-white/8 bg-charcoal-soft hover:border-gold/25 hover:bg-white/5'
                  }`}
                >
                  {/* Top colour band */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${svc.color}`} style={{ background: `linear-gradient(to right, ${svc.accent}66, ${svc.accent}22)` }} />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background:`${svc.accent}20`, border:`1px solid ${svc.accent}40` }}
                      >
                        <Icon className="w-5 h-5" style={{ color:svc.accent }} />
                      </div>
                      <span className="text-white/20 text-xs group-hover:text-white/40 transition-colors">
                        {isOpen ? '−' : '+'}
                      </span>
                    </div>

                    <h3
                      className="text-white font-semibold mb-2 leading-tight"
                      style={{ fontFamily:'var(--font-outfit)', fontSize:'0.95rem' }}
                    >
                      {svc.name}
                    </h3>
                    <p className="text-white/45 text-xs leading-relaxed">{svc.desc}</p>

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in">
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                          <Clock className="w-3 h-3 shrink-0" style={{ color:svc.accent }} />
                          {svc.hours}
                        </div>
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                          <Users className="w-3 h-3 shrink-0" style={{ color:svc.accent }} />
                          {svc.capacity}
                        </div>
                        <div className="space-y-1.5 pt-1">
                          {svc.highlights.map(h => (
                            <div key={h} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 shrink-0" style={{ color:svc.accent }} />
                              <span className="text-white/50 text-xs">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-charcoal-soft border-t border-gold/15 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Phone className="w-3 h-3 text-gold" />
            <span className="text-gold-light text-[0.65rem] tracking-[0.2em] uppercase font-medium">Get In Touch</span>
          </div>
          <h2
            className="text-white font-semibold mb-4"
            style={{ fontFamily:'var(--font-outfit)', fontSize:'clamp(1.6rem,4vw,2.4rem)', letterSpacing:'-0.02em' }}
          >
            Ready to Book a Service?
          </h2>
          <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-lg mx-auto font-light">
            All service bookings are handled personally by our team. Browse a room and include your service preferences in the special requests, or call us directly.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => router.push('/')} className="btn-gold px-8 py-3.5 text-[0.75rem]">
              Browse Rooms <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => router.push('/my-booking')} className="btn-ghost-white px-8 py-3.5 text-[0.75rem]">
              Track My Enquiry
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-gold/15 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gold text-lg font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Kingdom Royal</p>
          <p className="text-white/20 text-xs">For confirmed bookings, our team will contact you directly.</p>
        </div>
      </footer>
    </div>
  )
}