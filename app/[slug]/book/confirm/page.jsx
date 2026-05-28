// app/[slug]/book/confirm/page.jsx

import { Suspense } from 'react'
import ConfirmContent from './ConfirmContent'

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-gold animate-spin-slow" />
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}