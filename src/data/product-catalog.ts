export type ProductCatalogFamily = 'disposable' | 'pod-sys';

export type ProductCatalogImage = {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  alt?: string;
};

export type ProductCatalogItem = {
  title: string;
  href: string;
  family: ProductCatalogFamily;
  image: ProductCatalogImage;
};

/** Display order matches live antbar.com /all-products/ tabs. */
export const PRODUCT_CATALOG_ITEMS: ProductCatalogItem[] = [
  {
    title: 'AGP12000',
    href: '/disposable/agp12000-nicotine-disposable-vape/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/06/AGP12000-NEW.png',
      srcset:
        '/wp-content/uploads/2024/06/AGP12000-NEW.png 563w, /wp-content/uploads/2024/06/AGP12000-NEW-242x300.png 242w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 697,
      alt: 'AGP12000',
    },
  },
  {
    title: 'KT800',
    href: '/disposable/antbar-kt800/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/05/KT800.jpg',
      srcset: '/wp-content/uploads/2024/05/KT800.jpg 563w, /wp-content/uploads/2024/05/KT800-242x300.jpg 242w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 697,
    },
  },
  {
    title: 'AT800',
    href: '/disposable/at800-puffs-disposable-vape/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/03/AT800.png',
      srcset: '/wp-content/uploads/2024/03/AT800.png 563w, /wp-content/uploads/2024/03/AT800-242x300.png 242w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 697,
    },
  },
  {
    title: 'AG600',
    href: '/disposable/antbar-ag600/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/03/AG600.png',
      srcset: '/wp-content/uploads/2024/03/AG600.png 563w, /wp-content/uploads/2024/03/AG600-242x300.png 242w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 697,
    },
  },
  {
    title: 'ROCKET',
    href: '/disposable/antbar-rocket/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/03/ROCKET-1.png',
      srcset: '/wp-content/uploads/2024/03/ROCKET-1.png 563w, /wp-content/uploads/2024/03/ROCKET-1-242x300.png 242w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 697,
      alt: 'antbar rocket the popular disposable vape',
    },
  },
  {
    title: 'SA8000',
    href: '/disposable/antbar-sa8000/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/03/SA8000.png',
      srcset: '/wp-content/uploads/2024/03/SA8000.png 563w, /wp-content/uploads/2024/03/SA8000-242x300.png 242w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 697,
    },
  },
  {
    title: 'AHP10000',
    href: '/disposable/v10000-puffs-disposable-vape/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/05/ahp10000.png',
      srcset: '/wp-content/uploads/2024/05/ahp10000.png 563w, /wp-content/uploads/2024/05/ahp10000-222x300.png 222w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 760,
      alt: 'ahp10000',
    },
  },
  {
    title: 'ATB600',
    href: '/disposable/antbar-atb600/',
    family: 'disposable',
    image: {
      src: '/wp-content/uploads/2024/03/ATB600.png',
      srcset: '/wp-content/uploads/2024/03/ATB600.png 563w, /wp-content/uploads/2024/03/ATB600-222x300.png 222w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 760,
    },
  },
  {
    title: 'DAH6000',
    href: '/disposable/antbar-3000-6000/',
    family: 'pod-sys',
    image: {
      src: '/wp-content/uploads/2024/03/DAH6000.png',
      srcset: '/wp-content/uploads/2024/03/DAH6000.png 563w, /wp-content/uploads/2024/03/DAH6000-222x300.png 222w',
      sizes: '(max-width: 563px) 100vw, 563px',
      width: 563,
      height: 760,
    },
  },
];
