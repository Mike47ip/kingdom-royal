import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Footer from '@/components/ui/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-dm',
})

export const metadata = {
  title: 'Kingdom Royal Hotels',
  description: 'Browse rooms and submit your booking enquiry.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-[family-name:var(--font-dm)]">
        {children}
        <Footer />
      </body>
    </html>
  )
}