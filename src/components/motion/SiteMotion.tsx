'use client'

import { animate, motion, MotionConfig, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, type ReactNode } from 'react'

const easing = [0.22, 1, 0.36, 1] as const

export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
)

export const MotionPage = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    damping: 35,
    mass: 0.25,
    stiffness: 260,
  })

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion) return

    const animationControls: ReturnType<typeof animate>[] = []
    const sections = Array.from(root.querySelectorAll<HTMLElement>('section')).filter(
      (section) => !section.parentElement?.closest('section'),
    )
    const cards = Array.from(root.querySelectorAll<HTMLElement>('article'))

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const element = entry.target as HTMLElement
          animationControls.push(
            animate(
              element,
              { filter: 'blur(0px)', opacity: 1, transform: 'translateY(0px)' },
              { duration: 0.72, ease: easing },
            ),
          )
          sectionObserver.unobserve(element)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const element = entry.target as HTMLElement
          const siblingIndex = Array.from(element.parentElement?.children ?? []).indexOf(element)
          animationControls.push(
            animate(
              element,
              { opacity: 1 },
              { delay: Math.min(Math.max(siblingIndex, 0), 5) * 0.07, duration: 0.5, ease: 'easeOut' },
            ),
          )
          cardObserver.unobserve(element)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )

    sections.forEach((section) => {
      section.style.opacity = '0'
      section.style.filter = 'blur(5px)'
      section.style.transform = 'translateY(28px)'
      sectionObserver.observe(section)
    })
    cards.forEach((card) => {
      card.style.opacity = '0'
      cardObserver.observe(card)
    })

    return () => {
      sectionObserver.disconnect()
      cardObserver.disconnect()
      animationControls.forEach((control) => control.stop())
    }
  }, [pathname, prefersReducedMotion])

  return (
    <>
      {!prefersReducedMotion ? (
        <motion.div
          aria-hidden="true"
          className="fixed left-0 right-0 top-0 z-[100] h-0.5 origin-left bg-secondary"
          style={{ scaleX: progress }}
        />
      ) : null}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={prefersReducedMotion ? false : { opacity: 0.65, y: 12 }}
        key={pathname}
        ref={rootRef}
        transition={{ duration: 0.48, ease: easing }}
      >
        {children}
      </motion.div>
    </>
  )
}

export const MotionFooter = ({ children }: { children: ReactNode }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      transition={{ duration: 0.65, ease: easing }}
      viewport={{ amount: 0.1, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}
