import Marquee from '@/components/layout/Marquee'
import Navbar from '@/components/layout/Navbar'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fade-in flex-1 flex flex-col bg-paper text-ink">
      <Marquee />
      <Navbar />
      {children}
    </div>
  )
}
