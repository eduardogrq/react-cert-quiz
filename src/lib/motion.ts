import type { Variants, Transition } from 'framer-motion';

// --- Transitions ---

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
};

// --- Container variants (stagger children) ---

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// --- Item variants ---

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: springSnappy,
  },
};

// --- Page transition ---

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// --- Gesture presets ---

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springSnappy,
} as const;

export const hoverLift = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: springSnappy,
} as const;
