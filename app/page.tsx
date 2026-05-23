import { getJewels } from '@/lib/supabase'
import type { Jewel } from '@/types'
import Hero from '@/components/sections/Hero'
import Gallery from '@/components/sections/Gallery'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default async function Home() {
  let jewels: Jewel[] = []
  try {
    jewels = await getJewels()
  } catch (err) {
    console.error('[Supabase] getJewels failed:', err)
  }

  return (
    <main>
      <Hero />
      <Gallery jewels={jewels} />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
