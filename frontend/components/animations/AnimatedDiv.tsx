'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

// Tipos de animação otimizados
type AnimationType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideLeft'
  | 'slideRight'
  | 'slideDown'
  | 'scale'

interface AnimatedDivProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  once?: boolean
}

interface AnimatedContainerProps {
  children: ReactNode
  animationType?: AnimationType
  className?: string
  threshold?: number
  once?: boolean
}

// CSS classes para animações (mais rápidas que Framer Motion)
const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  slideDown: 'animate-slide-down',
  scale: 'animate-scale',
}

// Hook otimizado para detecção de visibilidade
function useIntersectionObserver(threshold = 0.1, once = true) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '50px' }
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
  }, [threshold, once])

  return [ref, isVisible] as const
}

export function AnimatedDiv({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  once = true,
}: AnimatedDivProps) {
  const [ref, isVisible] = useIntersectionObserver(threshold, once)

  return (
    <div
      ref={ref}
      className={`
        ${className}
        ${isVisible ? ANIMATION_CLASSES[animation] : 'opacity-0'}
        transition-all ease-out
      `}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}

// Export default para compatibilidade
export default AnimatedDiv

// Componente AnimatedContainer para compatibilidade
export function AnimatedContainer({
  children,
  animationType = 'fadeIn',
  className = '',
  threshold = 0.1,
  once = true,
}: AnimatedContainerProps) {
  const [ref, isVisible] = useIntersectionObserver(threshold, once)

  return (
    <div
      ref={ref}
      className={`
        ${className}
        ${isVisible ? ANIMATION_CLASSES[animationType] : 'opacity-0'}
        transition-all ease-out
      `}
    >
      {children}
    </div>
  )
}
