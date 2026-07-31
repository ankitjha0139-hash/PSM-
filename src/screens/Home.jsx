import Hero from '../components/marketing/Hero.jsx'
import ProblemSpace from '../components/marketing/ProblemSpace.jsx'
import Features from '../components/marketing/Features.jsx'
import Pricing from '../components/marketing/Pricing.jsx'
import Testimonials from '../components/marketing/Testimonials.jsx'
import Footer from '../components/marketing/Footer.jsx'

// The marketing/orientation screen — first stop for a new visitor. Its
// CTAs hand off into the real product screens via onNavigate; the
// Problem/Features/Testimonials sections stay in-page (id-anchored) since
// they're not separate screens, just scroll sections within Home.
export default function Home({ onNavigate }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <ProblemSpace />
      <Features />
      <Pricing onNavigate={onNavigate} />
      <Testimonials />
      <Footer onNavigate={onNavigate} />
    </>
  )
}
