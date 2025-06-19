'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { useInView, motion, AnimatePresence } from 'framer-motion'
import { animationVariants, type AnimationType } from './AnimationVariants'

// Custom hook para animar quando o elemento está visível
export function useAnimateOnView(
  threshold: number = 0.1,
  once: boolean = true
) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once, // Só anima uma vez por padrão
    margin: '0px 0px -100px 0px', // Trigger antes do elemento estar completamente visível
  })
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isInView) {
      setAnimate(true)
    } else if (!once) {
      setAnimate(false)
    }
  }, [isInView, once])

  return { ref, animate, isInView }
}

interface AnimatedDivProps {
  children: ReactNode
  animationType?: AnimationType
  delay?: number
  threshold?: number
  once?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
  whileHover?: boolean
}

const AnimatedDiv = ({
  children,
  animationType = 'fadeIn',
  delay = 0,
  threshold = 0.1,
  once = true,
  className = '',
  style,
  onClick,
  onHoverStart,
  onHoverEnd,
  whileHover = false,
  ...props
}: AnimatedDivProps) => {
  const { ref, animate } = useAnimateOnView(threshold, once)
  const selectedVariant = animationVariants[animationType]

  const motionProps: any = {
    ref,
    initial: 'hidden',
    animate: animate ? 'visible' : 'hidden',
    exit: 'hidden',
    variants: selectedVariant.child,
    className,
    style,
    onClick,
    onHoverStart,
    onHoverEnd,
    ...props,
  }

  // Adicionar hover animation se especificado
  if (whileHover && animationType === 'cardHover') {
    motionProps.whileHover = 'hover'
  }

  return <motion.div {...motionProps}>{children}</motion.div>
}

// Componente para container de múltiplos elementos animados
interface AnimatedContainerProps {
  children: ReactNode
  animationType?: AnimationType
  className?: string
  style?: React.CSSProperties
  threshold?: number
  once?: boolean
}

export const AnimatedContainer = ({
  children,
  animationType = 'fadeIn',
  className = '',
  style,
  threshold = 0.1,
  once = true,
  ...props
}: AnimatedContainerProps) => {
  const { ref, animate } = useAnimateOnView(threshold, once)
  const selectedVariant = animationVariants[animationType]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animate ? 'visible' : 'hidden'}
      variants={selectedVariant.container}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedDiv
