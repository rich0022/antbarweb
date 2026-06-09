export type ProductImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type ProductTextPanel = {
  backgroundImage: string;
  heading: string;
  paragraphs: string[];
  centered?: boolean;
  lightHeading?: boolean;
};

export type ProductSplitPanel = {
  backgroundImage: string;
  headingLines: string[];
  description: string;
  reverse?: boolean;
  image?: ProductImage;
};

export const AHP10000_HERO = {
  backgroundImage: '/wp-content/uploads/2024/05/AHP10000puffs-disposable-jpg.webp',
  title: 'AHP 10000',
  tagline: 'RELISH PUREST MOMENT',
  specHref: '#specfication',
  specButton: {
    src: '/wp-content/uploads/2024/05/kt800-specfication.webp',
    width: 270,
    height: 56,
    alt: 'View specifications',
  },
} as const;

export const AHP10000_SHOWCASE_IMAGE: ProductImage = {
  src: '/wp-content/uploads/2024/05/jpg.webp',
  width: 2540,
  height: 1476,
  alt: 'AHP10000 disposable vape showcase',
};

export const AHP10000_TEXT_PANELS: ProductTextPanel[] = [
  {
    backgroundImage: '/wp-content/uploads/2024/05/10000PUFFSa-scaled-1.webp',
    heading: 'UNBEATABLE PUFFS BRING TREASURABLE FUN',
    paragraphs: [
      'The device is reserved bulk of liquid to withold',
      "more than 10000 puffs to meet the user's maximum fulfilling vaping.",
    ],
    centered: true,
  },
  {
    backgroundImage: '/wp-content/uploads/2024/05/10种颜色A-scaled-1.webp',
    heading: '10 COLORS AVAILABLE',
    paragraphs: [],
    centered: true,
    lightHeading: true,
  },
];

export const AHP10000_SPLIT_PANELS: ProductSplitPanel[] = [
  {
    backgroundImage: '/wp-content/uploads/2024/05/a-scaled-1.webp',
    headingLines: ['ESSENTIAL INFORMATION', 'PRESENTED ON SCREEN'],
    description:
      'The functional screen illustrates the remaining liquid and battery level to avoid a "run out of" warning.',
  },
  {
    backgroundImage: '/wp-content/uploads/2024/05/A-1-jpg.webp',
    headingLines: ['MESH COIL FEATURES', 'HIGH ENERGY EFFICIENCY'],
    description:
      'Equipped with 1.1Ω coil features the high vapor conversion ratio to deliver full clouds and pure flavor.',
  },
  {
    backgroundImage: '/wp-content/uploads/2024/05/13-1-jpg.webp',
    headingLines: ['SPEED CHARGING', 'LONG-LASTING VAPING'],
    description:
      'Powered by a 600 mAh battery, and only 50 min to get full power, it is always a travel companion on the go.',
    image: {
      src: '/wp-content/uploads/2024/05/2-3.webp',
      width: 2326,
      height: 2115,
      alt: 'How to charge the AHP10000 disposable vape',
    },
  },
  {
    backgroundImage: '/wp-content/uploads/2024/05/A-1-jpg-1.webp',
    headingLines: ['UNIQUE VISUAL SHAPE', 'WELL-CRAFTED BUILD'],
    description:
      'Add an ancient Roman Doric column design into cutting-edge, the third-dimension curve sparkling with compact size makes it incredibly stylish.',
    reverse: true,
    image: {
      src: '/wp-content/uploads/2024/05/AHP10000-puffs-disposable-compact-and-exquisite.webp',
      width: 1425,
      height: 1052,
      alt: 'AHP10000 compact and exquisite disposable vape',
    },
  },
];

export const AHP10000_FLAVORS_IMAGE: ProductImage = {
  src: '/wp-content/uploads/2024/05/AHP-1000-DISPOSABLE-VAPE-20-flavors-scaled-1.webp',
  width: 2560,
  height: 2253,
  alt: 'AHP10000 disposable vape 20 flavors',
};

export const AHP10000_SPECS = [
  { label: 'Puffs：', value: '10000' },
  { label: 'Material:', value: 'Aluminum alloy+PCTG' },
  { label: 'Nicotine Strength:', value: '2%' },
  { label: 'Coil Resistance:', value: '1.1Ω' },
  { label: 'Battery Capacity:', value: '600mAh' },
  { label: 'Size:', value: '46*25*87.5mm' },
  { label: 'Constant Voltage Output:', value: '3.4V' },
] as const;

export const AHP10000_SPEC_PANEL = {
  backgroundImage: '/wp-content/uploads/2024/05/1-scaled-1.webp',
  heading: 'SPECIFICATIONS',
} as const;

export const AHP10000_PACKAGING_PANEL = {
  backgroundImage: '/wp-content/uploads/2024/05/a-scaled-2.webp',
  heading: 'PACKAGING',
} as const;
