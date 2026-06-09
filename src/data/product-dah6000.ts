export type ProductImageBlock = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type ProductSpecSection = {
  heading: string;
  description: string;
  image: ProductImageBlock;
};

export const DAH6000_HERO = {
  heading: 'DAH3000/6000 THE BEST DISPOSABLE VAPE KITS',
  image: {
    src: '/wp-content/uploads/2024/04/DAH3000-1.webp',
    width: 2560,
    height: 1008,
    alt: 'DAH3000 and DAH6000 disposable vape kits',
  },
} as const;

export const DAH6000_SPECS: ProductSpecSection[] = [
  {
    heading: 'DAH3000 SPECIFICATION',
    description:
      '6.5ml cartridge capacity, with 600mAH large battery capacity, can provide you with a full day of vaping experience!Compact and lightweight, type-c rechargeable!',
    image: {
      src: '/wp-content/uploads/2024/04/DAH3000-2.webp',
      width: 2560,
      height: 857,
      alt: 'DAH3000 specification diagram',
    },
  },
  {
    heading: 'DAH6000 SPECIFICATION',
    description:
      '10ml cartridge capacity, with 600mAH large battery capacity, can provide you with a full day of vaping experience!Compact and lightweight, type-c rechargeable!',
    image: {
      src: '/wp-content/uploads/2024/03/6000.webp',
      width: 2560,
      height: 848,
      alt: 'DAH6000 specification diagram',
    },
  },
];
