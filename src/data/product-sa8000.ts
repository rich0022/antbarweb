import { backgroundVideoFromMp4 } from '../lib/video-asset';

export const SA8000_HERO = {
  background: '/wp-content/uploads/2024/06/SA8000-2-jpg.avif',
  width: 1920,
  height: 1040,
  title: 'SA8000',
  subtitle: 'Keeps Worry Away',
  specHref: '#specfication',
  specButton: {
    src: '/wp-content/uploads/2024/05/kt800-specfication.webp',
    width: 270,
    height: 56,
    alt: 'View specifications',
  },
};

export const SA8000_VIDEO = {
  background: backgroundVideoFromMp4('/wp-content/uploads/2024/03/449_1-2540_x264_x264.mp4'),
  modal: '/wp-content/uploads/2023/12/SA8000-2023x264-x264-1.mp4',
};

export const SA8000_FEATURE_ROW_1 = [
  {
    image: '/wp-content/uploads/2024/03/2-1.avif',
    width: 342,
    height: 410,
    lines: ['1.1±0.1Ω', 'Mesh Coil'],
    labelPosition: 'top' as const,
    labelAlign: 'left' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/2-2.avif',
    width: 587,
    height: 410,
    lines: ['Aluminum Alloy', 'Material'],
    labelPosition: 'top' as const,
    labelAlign: 'left' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/2-3.avif',
    width: 342,
    height: 410,
    lines: ['Visual', 'Screen'],
    labelPosition: 'bottom' as const,
    labelAlign: 'center' as const,
  },
];

export const SA8000_FEATURE_ROW_2 = [
  {
    image: '/wp-content/uploads/2024/03/2-4.avif',
    width: 422,
    height: 253,
    lines: ['Rechargeable'],
    labelPosition: 'top' as const,
    labelAlign: 'center' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/2-5.webp',
    width: 422,
    height: 253,
    lines: ['8000', 'Puffs'],
    labelPosition: 'bottom' as const,
    labelAlign: 'left' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/2-6.avif',
    width: 422,
    height: 253,
    lines: ['Liquid Capacity 12ml'],
    labelPosition: 'top' as const,
    labelAlign: 'center' as const,
  },
];

export const SA8000_FLAVORS_PRIMARY = {
  heading: '27 MELLOW FLAVORS',
  badge: '/wp-content/uploads/2024/06/C449详情-2024.05.2_03-jpg.webp',
  badgeWidth: 480,
  badgeHeight: 80,
  image: '/wp-content/uploads/2024/06/449-俄罗斯口味.avif',
  imageWidth: 2094,
  imageHeight: 361,
};

export const SA8000_FLAVORS_NEW = {
  badge: '/wp-content/uploads/2024/06/C449详情-2024.05-2_11-1-jpg.webp',
  badgeWidth: 480,
  badgeHeight: 80,
  heading: '7 NEW FLAVOR',
  images: [
    {
      src: '/wp-content/uploads/2024/06/449-马来新口味-jpg.avif',
      width: 2094,
      height: 391,
    },
    {
      src: '/wp-content/uploads/2024/06/449-马来口味-jpg.avif',
      width: 2094,
      height: 364,
    },
  ],
};

export const SA8000_STORIES = [
  {
    image: '/wp-content/uploads/2024/03/4.avif',
    width: 1920,
    height: 1040,
    heading: 'Sleek Cutting-edge for Comfortable Grip',
    description:
      'Sleek cutting-edge with the characteristic of ergonomic is customized for comfortable grip and convenient carry.',
    align: 'center' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/5.avif',
    width: 1920,
    height: 1040,
    heading: 'Premium Technology Ensure Satisfied Experience',
    description:
      'The use of mesh coil fully vaporized liquid brings silky-smooth vapor and Soft and delicate flavor.',
    align: 'left' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/6.avif',
    width: 1920,
    height: 1040,
    heading: 'Sensitive Auto draw Activation',
    description:
      'Adopted rapid response sensor forinstant ignition imitates the nature of smoking and peaceful experience.',
    align: 'left' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/7.avif',
    width: 1920,
    height: 1040,
    heading: 'Come with Rechargeable Feature',
    description:
      'Introduced rechargeable function to improve vaping experience. Battery level can be displayed on the screen.',
    align: 'right' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/8.avif',
    width: 1920,
    height: 1040,
    heading: 'Instant Check on Remaining Liquid',
    description:
      'Screen display represents the remaining liquid, such a breakthrough design allows worry-free of liquid entirely used up.',
    align: 'right' as const,
    extraImage: {
      src: '/wp-content/uploads/2024/03/8-2.webp',
      width: 410,
      height: 142,
    },
  },
  {
    image: '/wp-content/uploads/2024/03/9.avif',
    width: 1919,
    height: 1042,
    heading: 'Shinning Hues with Stylish Structure',
    description:
      'Candy-toned surface and rubberized aluminum coating coexist perfectly striking the balance between flowery and endurable.',
    align: 'left' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/10-1.avif',
    width: 1920,
    height: 1040,
    heading: 'Delicious Flavor till the Last',
    description:
      'Constant voltage output sustains stable aerosol performance resulting in the same exceptional taste till the last.',
    align: 'left' as const,
    extraImage: {
      src: '/wp-content/uploads/2024/03/10-2.webp',
      width: 556,
      height: 308,
    },
  },
  {
    image: '/wp-content/uploads/2024/03/11-.avif',
    width: 1920,
    height: 1040,
    heading: 'Safeguard Setting Guarantees Vaping Safety',
    description:
      'Preset 10s overtime cut-off function for long-time vaping interruption and user protection.',
    align: 'center' as const,
  },
  {
    image: '/wp-content/uploads/2024/03/12.avif',
    width: 1920,
    height: 1040,
    heading: 'Most Puffs for Maximum Enjoyment',
    description:
      'Equipped with an 12 ml large liquid reservoir supporting 8000 puffs, the device is ready for your all-day vaping companion.',
    align: 'center' as const,
    lightText: true,
  },
];

export const SA8000_SPEC = {
  heading: 'SPECIFICATIONS',
  productImage: {
    src: '/wp-content/uploads/2024/06/SA8000-4-jpg.webp',
    width: 699,
    height: 950,
    alt: 'antbar SA8000 DISPOSABLE',
  },
  columns: [
    [
      { src: '/wp-content/uploads/2024/06/SA8000-5-jpg.webp', width: 408, height: 438 },
      { src: '/wp-content/uploads/2024/06/SA8000-6-jpg.webp', width: 408, height: 440 },
    ],
    [
      { src: '/wp-content/uploads/2024/06/SA8000-9-jpg.webp', width: 408, height: 440 },
      { src: '/wp-content/uploads/2024/06/SA8000-7-jpg.webp', width: 408, height: 440 },
    ],
    [
      { src: '/wp-content/uploads/2024/06/SA8000-10-jpg.webp', width: 408, height: 439 },
      { src: '/wp-content/uploads/2024/06/SA8000-8-jpg.webp', width: 409, height: 441 },
    ],
  ],
};

export const SA8000_WARNING = {
  image: '/wp-content/uploads/2024/03/14.avif',
  width: 1920,
  height: 1040,
};
