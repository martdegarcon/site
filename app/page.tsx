'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Logo from './components/Logo'
import BetterFloatingNavigation from './components/FloatingNavigation'
import Contacts from './components/Contacts'
import './globals.css'

export default function Home() {
  const containerRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResize = () => {
    // Реинициализация при изменении размера окна
    setTimeout(() => {
      window.dispatchEvent(new Event('repositionButtons'))
    }, 100)
  }

  return (
    <div className="container" ref={containerRef}>
      <Logo />
      <BetterFloatingNavigation />
      <Contacts />
    </div>
  )
}