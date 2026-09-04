'use client'

import { LoaderCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

const SkeletonBlock = ({ className }: { className?: string }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-primary/[0.08]', className)}>
      {!prefersReducedMotion ? (
        <motion.span
          animate={{ x: '110%' }}
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
          initial={{ x: '-110%' }}
          transition={{ duration: 1.35, ease: 'linear', repeat: Infinity, repeatDelay: 0.15 }}
        />
      ) : null}
    </div>
  )
}

export function PageLoadingSkeleton() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div aria-busy="true" aria-live="polite" className="min-h-[70vh] bg-cream-bg" role="status">
      <span className="sr-only">Halaman sedang dimuat</span>

      <section className="border-b border-border bg-white">
        <div className="mx-auto w-full max-w-container-max px-gutter-mobile py-8 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm font-bold text-primary">
            <motion.span
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              className="inline-flex"
              transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
            >
              <LoaderCircle aria-hidden="true" className="size-4" />
            </motion.span>
            Sedang memuat halaman
          </div>

          <div className="mt-7 grid gap-7 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <SkeletonBlock className="aspect-[16/9] w-full rounded-2xl" />
            </div>
            <div className="space-y-4 lg:col-span-5">
              <SkeletonBlock className="h-5 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-full sm:h-12" />
              <SkeletonBlock className="h-10 w-4/5 sm:h-12" />
              <div className="space-y-2 pt-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-11/12" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
              <SkeletonBlock className="mt-4 h-11 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div className="w-full max-w-md space-y-3">
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <SkeletonBlock className="h-8 w-4/5" />
            <SkeletonBlock className="h-4 w-full" />
          </div>
          <SkeletonBlock className="hidden h-10 w-32 rounded-xl sm:block" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="overflow-hidden rounded-2xl border border-border bg-white" key={index}>
              <SkeletonBlock className="aspect-[16/9] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <SkeletonBlock className="h-4 w-24 rounded-full" />
                <SkeletonBlock className="h-6 w-full" />
                <SkeletonBlock className="h-6 w-3/4" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
