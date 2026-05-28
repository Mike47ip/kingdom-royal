// app/[slug]/book/confirm/ConfirmContent.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Copy, Phone, Clock, ArrowRight } from 'lucide-react'

export default function ConfirmContent() {
  const router        = useRouter()
  const sp            = useSearchParams()
  const enquiryNumber = sp.get('enquiryNumber')
  const phone         = sp.get('phone') ? decodeURIComponent(sp.get('phone')) : ''
  const [copied,  setCopied]  = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  if (!enquiryNumber) { router.push('/'); return null }

  function copy() {
    navigator.clipboard.writeText(enquiryNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize: '38px 38px' }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)' }}
      />

      <div
        className="relative max-w-lg w-full text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}
      >
        <div className="w-[72px] h-[72px] mx-auto mb-7 flex items-center justify-center rounded-full bg-gold/12 border-2 border-gold/35">
          <CheckCircle className="w-8 h-8 text-gold" />
        </div>

        <p className="text-gold-light text-[0.62rem] tracking-[0.22em] uppercase mb-3">Enquiry Submitted</p>

        <h1
          className="font-semibold text-white font-normal leading-tight mb-4"
          style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em' }}
        >
          We've received your enquiry
        </h1>

        <p className="text-white/45 text-sm leading-relaxed mb-10 font-light">
          Our team will review your request and contact you on{' '}
          <strong className="text-white/80 font-medium">{phone}</strong> to finalise your reservation.
        </p>

        <div className="bg-white/5 border border-gold/30 p-7 mb-8">
          <p className="text-white/35 text-[0.62rem] tracking-[0.2em] uppercase mb-3">Your Enquiry Reference</p>
          <p
            className="text-gold text-3xl tracking-widest mb-4"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {enquiryNumber}
          </p>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 border border-white/15 text-white/55 hover:text-white/80 hover:border-white/30 transition-colors text-xs tracking-wide px-5 py-2 bg-transparent cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Copied!' : 'Copy Reference'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { icon: Phone, title: "We'll call you",  desc: "Our team will reach out to discuss and confirm your booking" },
            { icon: Clock, title: "Response time",   desc: "Usually within a few hours during business hours" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/[0.04] border border-white/8 p-5 text-left">
              <Icon className="w-4 h-4 text-gold mb-2.5" />
              <p className="text-white text-xs font-medium mb-1.5">{title}</p>
              <p className="text-white/40 text-[0.72rem] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <hr className="border-white/8 mb-8" />

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => router.push(`/my-booking?enquiryNumber=${enquiryNumber}&phone=${encodeURIComponent(phone)}`)}
            className="btn-gold text-[0.72rem]"
          >
            Track Enquiry <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => router.push('/')} className="btn-ghost-white text-[0.72rem]">
            Back to Hotels
          </button>
        </div>

        <p className="text-white/20 text-xs mt-8">Save your reference number to track or cancel your enquiry.</p>
      </div>
    </div>
  )
}