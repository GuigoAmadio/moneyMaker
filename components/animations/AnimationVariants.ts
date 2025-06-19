export type AnimationType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideLeft'
  | 'slideRight'
  | 'wiper'
  | 'scale'
  | 'bounce'
  | 'cardHover'
  | 'parallax'

export const animationVariants = {
  fadeIn: {
    container: {
      hidden: { opacity: 0 },
      visible: (i: number = 1) => ({
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: i * 0.1,
        },
      }),
    },
    child: {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        y: 20,
      },
    },
  },

  slideUp: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    child: {
      hidden: {
        y: 60,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 120,
        },
      },
    },
  },

  slideLeft: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    child: {
      hidden: {
        x: -60,
        opacity: 0,
      },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 120,
        },
      },
    },
  },

  slideRight: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    child: {
      hidden: {
        x: 60,
        opacity: 0,
      },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 120,
        },
      },
    },
  },

  wiper: {
    container: {
      hidden: {},
      visible: {},
    },
    child: {
      hidden: {
        clipPath: 'inset(0% 100% 0% 0%)',
      },
      visible: {
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: {
          duration: 0.8,
          ease: [0.65, 0, 0.35, 1],
        },
      },
    },
  },

  scale: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    child: {
      hidden: {
        scale: 0.8,
        opacity: 0,
      },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 100,
        },
      },
    },
  },

  bounce: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    child: {
      hidden: {
        y: -20,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 15,
          stiffness: 200,
          bounce: 0.4,
        },
      },
    },
  },

  cardHover: {
    container: {
      hidden: {},
      visible: {},
    },
    child: {
      hidden: {},
      visible: {},
      hover: {
        y: -8,
        scale: 1.02,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 300,
        },
      },
    },
  },

  parallax: {
    container: {
      hidden: {},
      visible: {},
    },
    child: {
      hidden: {
        y: 100,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 100,
        },
      },
    },
  },
}
