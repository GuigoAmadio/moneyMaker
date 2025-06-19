'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  offset?: string[]
}

export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  offset = ['start end', 'end start'],
}: ScrollRevealProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  })

  const spring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return {
          y: useTransform(spring, [0, 1], [100, 0]),
          opacity: useTransform(spring, [0, 0.2, 1], [0, 0, 1]),
        }
      case 'down':
        return {
          y: useTransform(spring, [0, 1], [-100, 0]),
          opacity: useTransform(spring, [0, 0.2, 1], [0, 0, 1]),
        }
      case 'left':
        return {
          x: useTransform(spring, [0, 1], [-100, 0]),
          opacity: useTransform(spring, [0, 0.2, 1], [0, 0, 1]),
        }
      case 'right':
        return {
          x: useTransform(spring, [0, 1], [100, 0]),
          opacity: useTransform(spring, [0, 0.2, 1], [0, 0, 1]),
        }
      default:
        return {
          y: useTransform(spring, [0, 1], [50, 0]),
          opacity: useTransform(spring, [0, 0.2, 1], [0, 0, 1]),
        }
    }
  }

  const transform = getTransform()

  return (
    <motion.div
      ref={ref}
      style={{
        ...transform,
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
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
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
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
  const letters = text.split('')

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay, staggerChildren: 0.05 }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Componente para counter animado
interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({
  from,
  to,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const count = useTransform(scrollYProgress, [0, 1], [from, to])
  const rounded = useTransform(count, (value) => Math.round(value))

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}
