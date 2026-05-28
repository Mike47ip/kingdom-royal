'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function Navbar({ back, backLabel = 'Back', title, children }) {
  const router = useRouter()

  return (
    <nav className="bg-charcoal sticky top-0 z-50 px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {back && (
          <>
            <button
              onClick={() => back === true ? router.back() : router.push(back)}
              className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-sm cursor-pointer bg-transparent border-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {backLabel}
            </button>
            <div className="w-px h-4 bg-white/15" />
          </>
        )}
        {title && (
<span className="text-gold text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
  {title}
</span>
        )}
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </nav>
  )
}
