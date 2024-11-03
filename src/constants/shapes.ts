export const SHAPE_CONSTANTS = {
  HEART: {
    DURATION: {
      NORMAL: 1000,
      CROWNED: 600
    },
    SCALE: {
      MIN: 0.8,
      MAX: 1.2
    },
    GLOW: {
      NORMAL: 15,
      CROWNED: 25
    }
  },
  STAR: {
    POINTS: 12,
    RADIUS: {
      OUTER: 800,
      INNER: 480, // 800 * 0.6
      MIDDLE: 640 // 800 * 0.8
    },
    ROTATION_DURATION: 5000,
    COLORS: {
      PRIMARY: {
        R: 0,
        G: 100,
        B: 255
      },
      GLOW: {
        MIN_SIZE: 10,
        MAX_SIZE: 25,
        MIN_OPACITY: 0.3,
        MAX_OPACITY: 0.7
      }
    },
    ANIMATION: {
      SWAY: {
        DURATION: {
          MIN: 2000,
          MAX: 3000
        },
        AMPLITUDE: 10
      }
    }
  }
}; 