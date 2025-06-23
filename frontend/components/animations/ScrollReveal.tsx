'use client'

import { useRef, useEffect, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}

export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay])

  const getDirectionClass = () => {
    const base = 'transition-all duration-700 ease-out'
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${base} opacity-0 translate-y-10`
        case 'down':
          return `${base} opacity-0 -translate-y-10`
        case 'left':
          return `${base} opacity-0 -translate-x-10`
        case 'right':
          return `${base} opacity-0 translate-x-10`
        default:
          return `${base} opacity-0 translate-y-10`
      }
    }
    return `${base} opacity-100 translate-x-0 translate-y-0`
  }

  return (
    <div ref={ref} className={`${getDirectionClass()} ${className}`}>
      {children}
    </div>
  )
}

// Componente para parallax simples
interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({
  children,
  speed = 0.5,
  className = '',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffset(rate)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  )
}

// Componente para texto que aparece letra por letra
interface TypewriterProps {
  text: string
  className?: string
  delay?: number
}

export function Typewriter({
  text,
  className = '',
  delay = 0,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }
      },
      delay + currentIndex * 50
    )

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return <span className={className}>{displayedText}</span>
}

// Componente para counter animado
interface AnimatedCounterProps {
  from: number
  to: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({
  from,
  to,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(from)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 segundos
    const steps = 60
    const increment = (to - from) / steps
    const stepTime = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const newCount = Math.min(from + increment * currentStep, to)
      setCount(Math.round(newCount))

      if (currentStep >= steps) {
        clearInterval(timer)
        setCount(to)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isVisible, from, to])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span>{count}</span>
      {suffix}
    </span>
  )
}
