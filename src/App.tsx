import { useEffect, useRef, useState } from 'react'
import logo from './assets/logo.jfif'
import backgroundVideo from './assets/videos/backgroun.mp4'
import dragonVideo from './assets/videos/dragon.mp4'
import hotelVideo from './assets/videos/hotel.mp4'
import performanceVideo from './assets/videos/performance.mp4'
import planetVideo from './assets/videos/planet visit.mp4'
import seaGoatVideo from './assets/videos/sea goat.mp4'
import zooVideo from './assets/videos/zoo.mp4'
import './App.css'

const videos = [
  { src: hotelVideo, title: 'Hotel' },
  { src: planetVideo, title: 'Planet visit' },
  { src: zooVideo, title: 'Zoo' },
]

const agencyTitle = "Sri Lanka's Premier Web Design & Development Agency"

const portfolioItems = Object.entries(
  import.meta.glob('./assets/images/*.jfif', { eager: true, query: '?url', import: 'default' }),
)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([path, image]) => ({
    image: image as string,
    title: path.split('/').pop()?.replace(/\.jfif$/i, '') ?? 'Portfolio project',
  }))

const agencyMetrics = [
  { value: 28, suffix: '+', label: <>Years of<br />Experience</> },
  { value: 187, suffix: '+', label: <>Awards</> },
  { value: 50, suffix: '+', label: <>Security Audits<br />Passed</> },
  { value: 20, suffix: '+', label: <>Autonomous<br />Agents Deployed</> },
  { value: 1400, suffix: '+', label: <>Successful<br />Projects</> },
]

const performanceFacts = [
  { title: 'Security', text: 'AI threat detection stops sophisticated attacks.' },
  { title: 'Reliability', text: 'Custom infrastructure keeps websites dependable.' },
  { title: 'Performance', text: 'Modern systems deliver industry-leading speed.' },
  { title: 'Quality', text: 'We deliver beyond demanding quality standards.' },
  { title: 'Passion', text: 'We love building better websites.' },
  { title: 'Integrity', text: 'Integrity guides every decision we make.' },
]

function PerformanceFact({ title, text, index }: { title: string; text: string; index: number }) {
  const factRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fact = factRef.current
    if (!fact) return

    const updateVisibility = () => {
      const bounds = fact.getBoundingClientRect()
      setIsVisible(bounds.top < window.innerHeight * 0.9 && bounds.bottom > window.innerHeight * 0.1)
    }

    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    updateVisibility()

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  return (
    <div
      ref={factRef}
      className={`performance-fact${isVisible ? ' is-visible' : ''}`}
      style={{ animationDelay: `${(index % 3) * 100}ms` }}
    >
      <div className="performance-subtitle">
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  )
}

function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [typedCharacterCount, setTypedCharacterCount] = useState(0)
  const activeItem = portfolioItems[activeIndex]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % portfolioItems.length)
      setTypedCharacterCount(0)
    }, 5200)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setTypedCharacterCount((current) => Math.min(current + 1, activeItem.title.length))
    }, 70)
    return () => window.clearInterval(interval)
  }, [activeItem.title, activeIndex])

  const typedTitle = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? activeItem.title
    : activeItem.title.slice(0, typedCharacterCount)

  return (
    <section className="portfolio-section" id="investors" aria-labelledby="portfolio-title">
      <div className="portfolio-copy">
        <p className="eyebrow">A SELECTION OF OUR WORK</p>
        <h2 id="portfolio-title">Portfolio<span>.</span></h2>
        <p className="portfolio-description">Digital experiences shaped around each project, audience, and ambition.</p>
        <div className="portfolio-caption" aria-live="polite">
          <h3>{typedTitle}<span className="typing-caret" aria-hidden="true" /></h3>
        </div>
      </div>
      <div className="portfolio-stage" aria-live="polite">
        <div className="portfolio-image-window">
          {portfolioItems.map((item, index) => (
            <img
              key={item.image}
              className={`portfolio-image${index === activeIndex ? ' is-active' : ''}`}
              src={item.image}
              alt={`${item.title} portfolio preview`}
              aria-hidden={index !== activeIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function AgencyMetric({
  value,
  suffix,
  label,
  index,
}: (typeof agencyMetrics)[number] & { index: number }) {
  const metricRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const metric = metricRef.current
    if (!metric) return

    let frame = 0
    let hasStarted = false

    const startCount = () => {
      if (hasStarted) return
      hasStarted = true
      setIsVisible(true)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setCount(value)
        return
      }

      const startTime = performance.now()
      const duration = 1100
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setCount(Math.round(value * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const checkVisibility = () => {
      const bounds = metric.getBoundingClientRect()
      if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > window.innerHeight * 0.1) {
        startCount()
      }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility)
    checkVisibility()

    return () => {
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <div
      ref={metricRef}
      className={`agency-metric${isVisible ? ' is-visible' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <strong aria-label={`${value.toLocaleString('en-US')}${suffix}`}>
        {count.toLocaleString('en-US')}{suffix}
      </strong>
      <span>{label}</span>
    </div>
  )
}

function DragonFlight() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { willReadFrequently: true })
    if (!video || !canvas || !context) return

    let frame = 0
    let previousTime = -1

    const renderFrame = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.currentTime !== previousTime) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const image = context.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = image.data

        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index]
          const green = pixels[index + 1]
          const blue = pixels[index + 2]
          const brightness = (red + green + blue) / 3
          const saturation = Math.max(red, green, blue) - Math.min(red, green, blue)

          if (saturation < 28 && brightness > 76 && brightness < 216) {
            pixels[index + 3] = Math.round(pixels[index + 3] * Math.max(0, (saturation - 8) / 20))
          }
        }

        context.putImageData(image, 0, 0)
        previousTime = video.currentTime
      }

      frame = requestAnimationFrame(renderFrame)
    }

    frame = requestAnimationFrame(renderFrame)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="dragon-flight" aria-hidden="true">
      <video
        ref={videoRef}
        src={dragonVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      <canvas ref={canvasRef} width="960" height="540" />
    </div>
  )
}

function App() {
  const [activeVideo, setActiveVideo] = useState(0)
  const visibleVideos = [-1, 0, 1].map((offset) => {
    const videoIndex = (activeVideo + offset + videos.length) % videos.length

    return {
      ...videos[videoIndex],
      videoIndex,
      offset,
    }
  })
  const agencySectionRef = useRef<HTMLElement>(null)
  const [isAgencyVisible, setIsAgencyVisible] = useState(false)
  useEffect(() => {
    const section = agencySectionRef.current
    if (!section) return

    const checkVisibility = () => {
      const bounds = section.getBoundingClientRect()
      if (bounds.top < window.innerHeight * 0.85 && bounds.bottom > window.innerHeight * 0.15) {
        setIsAgencyVisible(true)
        window.removeEventListener('scroll', checkVisibility)
        window.removeEventListener('resize', checkVisibility)
      }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility)
    checkVisibility()

    return () => {
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  return (
    <main>
      <video className="site-background-video" src={backgroundVideo} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <div className="site-background-tint" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="3CS home">
          <span className="brand-mark"><img src={logo} alt="" /></span>
          <span className="brand-name">3CS<span>.</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <span className="nav-label">Clients</span>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <span className="nav-label">Investors</span>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#contact">Let&apos;s talk <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-copy">
          <h1>Make room<br />for <span>what&apos;s next.</span></h1>
          <p className="hero-description">We bring people and technology together to create meaningful progress for businesses, communities, and the world around us.</p>
          <div className="hero-actions">
            <a className="button button-primary hero-action-button" href="#investors">Explore Portfolio <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#about">Meet 3CS <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-art" role="group" aria-label="Featured 3CS videos">
          {visibleVideos.map(({ src, title, videoIndex, offset }) => (
            <video
              key={`${videoIndex}-${offset}`}
              className={`video-slide ${offset === -1 ? 'is-left' : offset === 1 ? 'is-right' : 'is-center'}`}
              src={src}
              autoPlay
              muted
              playsInline
              loop={offset !== 0}
              preload="auto"
              aria-label={`${title} video${offset === 0 ? ', playing now' : ''}`}
              onEnded={offset === 0 ? () => setActiveVideo((current) => (current + 1) % videos.length) : undefined}
            />
          ))}
        </div>
        <a className="scroll-cue" href="#clients"><span className="scroll-line" /> Scroll to explore</a>
      </section>

      <section className="client-strip" id="clients">
        <p className="section-kicker">TRUSTED TO MOVE BUSINESS FORWARD</p>
        <div className="client-list" aria-label="Industries we work with">
          <span>FINANCIAL SERVICES</span><span className="client-separator" />
          <span>PUBLIC SECTOR</span><span className="client-separator" />
          <span>HEALTHCARE</span><span className="client-separator" />
          <span>ENTERPRISE</span><span className="client-separator" />
          <span>STARTUPS</span>
        </div>
      </section>

      <section ref={agencySectionRef} className="agency-overview" id="about" aria-labelledby="agency-title">
        <video
          className="agency-video"
          src={seaGoatVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="agency-video-shade" />
        <div className="agency-content">
          <div className="agency-intro">
            <h2 id="agency-title" aria-label={agencyTitle}>
              {agencyTitle.split(' ').map((word) => (
                <span
                  className={`agency-title-word${isAgencyVisible ? ' is-visible' : ''}`}
                  key={word}
                  aria-hidden="true"
                  style={{ animationDelay: `${agencyTitle.split(' ').indexOf(word) * 100}ms` }}
                >
                  {word}
                </span>
              ))}
            </h2>
            <div className="agency-summary">
              <p>With over 28 years of industry experience, 3CS specialises in web design, AI agents, security and digital marketing, delivering bespoke solutions to an exclusive global clientele.</p>
            </div>
          </div>
          <div className="agency-metrics" aria-label="3CS at a glance">
            {agencyMetrics.map((metric, index) => (
              <AgencyMetric key={metric.value} {...metric} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="philosophy-section" id="services" aria-labelledby="philosophy-title">
        <div className="philosophy-content">
          <div className="philosophy-list">
            <article className="philosophy-card">
              <span className="philosophy-number" aria-hidden="true">01</span>
              <h3>Design Vision</h3>
              <p>Crafting User-Focused, Technology-Driven Experiences That Seamlessly Integrate Brand Storytelling With Cutting-Edge Digital Solutions.</p>
            </article>
            <article className="philosophy-card">
              <span className="philosophy-number" aria-hidden="true">02</span>
              <h3>Data Driven</h3>
              <p>We Leverage Data Analytics, Deep Insights Into User Behaviour, And AI Technologies To Continuously Set New Benchmarks For Engagement And Usability Across Platforms.</p>
            </article>
            <article className="philosophy-card">
              <span className="philosophy-number" aria-hidden="true">03</span>
              <h3>Audience Focus</h3>
              <p>Content And Functionality Tailored By Insights From An In-Depth Understanding Of Your Key Audiences, To Create Highly Engaging User Journeys That Result In Maximising Business Objectives.</p>
            </article>
          </div>
          <h2 id="philosophy-title">Our Design<br /><span>Philosophy</span></h2>
        </div>
        <DragonFlight />
      </section>

      <section className="performance-intro" aria-labelledby="performance-title">
        <p className="eyebrow">BUILT TO PERFORM</p>
        <h2 id="performance-title">Performance<span>.</span></h2>
      </section>

      <section className="performance-section" aria-label="3CS performance and values">
        <div className="performance-frame">
          <video className="performance-video" src={performanceVideo} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
          <div className="performance-facts" aria-label="Performance, security, reliability, quality, passion, and integrity">
            {performanceFacts.map((fact, index) => (
              <PerformanceFact key={fact.title} {...fact} index={index} />
            ))}
          </div>
        </div>
      </section>

      <PortfolioSection />

      <section className="contact-section" id="contact">
        <div className="contact-inner"><p className="eyebrow">04 — START A CONVERSATION</p><h2>Have a good<br />challenge?</h2><div className="contact-bottom"><p>Tell us what you&apos;re working on.<br />We&apos;re always up for a thoughtful conversation.</p><a className="contact-link" href="mailto:hello@3cs.lk">Let&apos;s make it happen <span aria-hidden="true">↗</span></a></div></div>
        <div className="contact-mark" aria-hidden="true">3<span>C</span>S</div>
      </section>

      <footer className="site-footer">
        <div className="footer-columns">
          <section className="footer-column" aria-labelledby="footer-contact">
            <h2 id="footer-contact">Contact Us</h2>
            <dl className="footer-contact-list">
              <div><dt>Email Address</dt><dd><a href="mailto:info@3cs.lk">info@3cs.lk</a></dd></div>
              <div><dt>Telephone</dt><dd><a href="tel:+94759100662">+94 759 100 662</a></dd></div>
              <div><dt>Address</dt><dd>352, Embuldeniya Road,<br />Sri Jayawardenepura Kotte</dd></div>
            </dl>
          </section>
          <section className="footer-column" aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links">Quick Links</h2>
            <ul>
              <li><a href="#investors">Portfolio</a></li>
              <li>Clients</li>
              <li>Awards</li>
              <li><a href="#services">Services</a></li>
              <li>Investors</li>
              <li><a href="#about">About</a></li>
              <li>FAQ</li>
              <li>Sitemap</li>
            </ul>
          </section>
          <section className="footer-column" aria-labelledby="footer-legal">
            <h2 id="footer-legal">Legal</h2>
            <ul>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
              <li>Anti-Bribery, Anti-Corruption &amp;<br />Money Laundering Policy</li>
              <li>Environmental Policy</li>
              <li>Supplier Quality Policy</li>
              <li>Security Policy</li>
            </ul>
          </section>
          <section className="footer-column" aria-labelledby="footer-social">
            <h2 id="footer-social">Social Media</h2>
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>Linkedin</li>
            </ul>
          </section>
        </div>
        <div className="footer-bottom">
          <p>© 2026 3CS Asia (Private) Limited</p>
        </div>
      </footer>
    </main>
  )
}

export default App
