// app/my-booking/page.jsx

import { Suspense } from 'react'
import MyBookingContent from './MyBookingContent'

export default function MyBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-warm-border border-t-gold animate-spin-slow" />
      </div>
    }>
      <MyBookingContent />
    </Suspense>
  )
}