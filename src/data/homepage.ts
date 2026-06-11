export interface ResponsiveImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
}

export interface HeroSlide {
  id: string;
  desktopImage: ResponsiveImage;
  mobileImage: ResponsiveImage;
  link: string;
  titleImage?: ResponsiveImage & { alt: string };
  heading: string;
  headingTag?: string;
}

export const HERO_CAROUSEL_SLIDES: HeroSlide[] = [
  {
    id: 'slide1',
    desktopImage: {
      src: '/wp-content/uploads/2024/11/banner1.avif',
      srcset:
        '/wp-content/uploads/2024/11/banner1.avif 2560w, /wp-content/uploads/2024/11/banner1-300x135.avif 300w, /wp-content/uploads/2024/11/banner1-1024x460.avif 1024w, /wp-content/uploads/2024/11/banner1-768x345.avif 768w, /wp-content/uploads/2024/11/banner1-1536x690.avif 1536w, /wp-content/uploads/2024/11/banner1-2048x920.avif 2048w',
      sizes: '(max-width: 2560px) 100vw, 2560px',
      width: 2560,
      height: 1150,
    },
    mobileImage: {
      src: '/wp-content/uploads/2024/11/移动端-BANNER1.avif',
      srcset:
        '/wp-content/uploads/2024/11/移动端-BANNER1.avif 1170w, /wp-content/uploads/2024/11/移动端-BANNER1-182x300.avif 182w, /wp-content/uploads/2024/11/移动端-BANNER1-620x1024.avif 620w, /wp-content/uploads/2024/11/移动端-BANNER1-768x1268.avif 768w, /wp-content/uploads/2024/11/移动端-BANNER1-931x1536.avif 931w',
      sizes: '(max-width: 1170px) 100vw, 1170px',
      width: 1170,
      height: 1931,
    },
    link: '/disposable/antbar-sa8000/',
    titleImage: {
      src: '/wp-content/uploads/2024/03/HOME-SA800-TITLE.png',
      srcset:
        '/wp-content/uploads/2024/03/HOME-SA800-TITLE.png 679w, /wp-content/uploads/2024/03/HOME-SA800-TITLE-300x40.png 300w',
      sizes: '(max-width: 679px) 100vw, 679px',
      width: 679,
      height: 90,
      alt: 'SA8000 8000puff disposable vape kit 12ml e-juice',
    },
    heading: 'KEEP WORRY AWAY',
  },
  {
    id: 'slide2',
    desktopImage: {
      src: '/wp-content/uploads/2024/11/banner2.avif',
      srcset:
        '/wp-content/uploads/2024/11/banner2.avif 2560w, /wp-content/uploads/2024/11/banner2-300x135.avif 300w, /wp-content/uploads/2024/11/banner2-1024x460.avif 1024w, /wp-content/uploads/2024/11/banner2-768x345.avif 768w, /wp-content/uploads/2024/11/banner2-1536x690.avif 1536w, /wp-content/uploads/2024/11/banner2-2048x920.avif 2048w',
      sizes: '(max-width: 2560px) 100vw, 2560px',
      width: 2560,
      height: 1150,
    },
    mobileImage: {
      src: '/wp-content/uploads/2024/11/移动端-BANNER.avif',
      srcset:
        '/wp-content/uploads/2024/11/移动端-BANNER.avif 1170w, /wp-content/uploads/2024/11/移动端-BANNER-182x300.avif 182w, /wp-content/uploads/2024/11/移动端-BANNER-620x1024.avif 620w, /wp-content/uploads/2024/11/移动端-BANNER-768x1268.avif 768w, /wp-content/uploads/2024/11/移动端-BANNER-931x1536.avif 931w',
      sizes: '(max-width: 1170px) 100vw, 1170px',
      width: 1170,
      height: 1931,
    },
    link: '/disposable/antbar-rocket/',
    titleImage: {
      src: '/wp-content/uploads/2024/03/HOME-ROCKET-TITLE.png',
      srcset:
        '/wp-content/uploads/2024/03/HOME-ROCKET-TITLE.png 749w, /wp-content/uploads/2024/03/HOME-ROCKET-TITLE-300x36.png 300w',
      sizes: '(max-width: 749px) 100vw, 749px',
      width: 749,
      height: 90,
      alt: 'ROCKET disposable vape kit',
    },
    heading: 'CRUSH ON ROCKET',
  },
  {
    id: 'slide3',
    desktopImage: {
      src: '/wp-content/uploads/2024/11/banner3.avif',
      srcset:
        '/wp-content/uploads/2024/11/banner3.avif 2560w, /wp-content/uploads/2024/11/banner3-300x135.avif 300w, /wp-content/uploads/2024/11/banner3-1024x460.avif 1024w, /wp-content/uploads/2024/11/banner3-768x345.avif 768w, /wp-content/uploads/2024/11/banner3-1536x690.avif 1536w, /wp-content/uploads/2024/11/banner3-2048x920.avif 2048w',
      sizes: '(max-width: 2560px) 100vw, 2560px',
      width: 2560,
      height: 1150,
    },
    mobileImage: {
      src: '/wp-content/uploads/2024/11/banner3-m.avif',
      srcset:
        '/wp-content/uploads/2024/11/banner3-m.avif 1170w, /wp-content/uploads/2024/11/banner3-m-182x300.avif 182w, /wp-content/uploads/2024/11/banner3-m-620x1024.avif 620w, /wp-content/uploads/2024/11/banner3-m-768x1268.avif 768w, /wp-content/uploads/2024/11/banner3-m-931x1536.avif 931w',
      sizes: '(max-width: 1170px) 100vw, 1170px',
      width: 1170,
      height: 1931,
    },
    link: '/disposable/agp12000-nicotine-disposable-vape/',
    headingTag: 'AGP12000',
    heading: 'THREE-IN-ONE',
  },
] as const;

export const PRODUCT_HIGHLIGHT = {
  link: '/disposable/antbar-sa8000/',
  image: {
    src: '/wp-content/uploads/2024/11/home2.avif',
    srcset:
      '/wp-content/uploads/2024/11/home2.avif 2560w, /wp-content/uploads/2024/11/home2-300x116.avif 300w, /wp-content/uploads/2024/11/home2-1024x395.avif 1024w, /wp-content/uploads/2024/11/home2-768x296.avif 768w, /wp-content/uploads/2024/11/home2-1536x593.avif 1536w, /wp-content/uploads/2024/11/home2-2048x790.avif 2048w',
    sizes: '(max-width: 2560px) 100vw, 2560px',
    width: 2560,
    height: 988,
  },
} as const;

export const PRODUCT_INTRO = {
  heading: 'PRODUCT',
  buttonText: 'Learn More',
  buttonHref: '/all-products/',
} as const;

export interface ProductGridItem {
  id: string;
  name: string;
  href: string;
  image: ResponsiveImage;
  animation: string;
  layout: 'stack-left' | 'feature-center' | 'stack-right';
}

export const PRODUCT_GRID_ITEMS: ProductGridItem[] = [
  {
    id: 'at800',
    name: 'AT800',
    href: '/disposable/at800-puffs-disposable-vape/',
    image: {
      src: '/wp-content/uploads/2024/11/AT800-png.avif',
      srcset:
        '/wp-content/uploads/2024/11/AT800-png.avif 624w, /wp-content/uploads/2024/11/AT800-300x232.avif 300w',
      sizes: '(max-width: 624px) 100vw, 624px',
      width: 624,
      height: 483,
    },
    animation: 'fadeInLeft',
    layout: 'stack-left',
  },
  {
    id: 'ag600',
    name: 'AG600',
    href: '/disposable/antbar-ag600/',
    image: {
      src: '/wp-content/uploads/2024/11/AG600-png.avif',
      srcset:
        '/wp-content/uploads/2024/11/AG600-png.avif 624w, /wp-content/uploads/2024/11/AG600-300x232.avif 300w',
      sizes: '(max-width: 624px) 100vw, 624px',
      width: 624,
      height: 483,
    },
    animation: 'fadeInLeft',
    layout: 'stack-left',
  },
  {
    id: 'rocket',
    name: 'ROCKET',
    href: '/disposable/antbar-rocket/',
    image: {
      src: '/wp-content/uploads/2024/11/homepage-SA8000-png.avif',
      srcset:
        '/wp-content/uploads/2024/11/homepage-SA8000-png.avif 624w, /wp-content/uploads/2024/11/homepage-SA8000-187x300.avif 187w',
      sizes: '(max-width: 624px) 100vw, 624px',
      width: 624,
      height: 1002,
    },
    animation: 'fadeInUp',
    layout: 'feature-center',
  },
  {
    id: 'agp12000',
    name: 'AGP12000',
    href: '/disposable/agp12000-nicotine-disposable-vape/',
    image: {
      src: '/wp-content/uploads/2024/11/agp12000-png.avif',
      srcset:
        '/wp-content/uploads/2024/11/agp12000-png.avif 624w, /wp-content/uploads/2024/11/agp12000-300x232.avif 300w',
      sizes: '(max-width: 624px) 100vw, 624px',
      width: 624,
      height: 483,
    },
    animation: 'fadeInRight',
    layout: 'stack-right',
  },
  {
    id: 'kt800',
    name: 'KT800',
    href: '/disposable/antbar-kt800/',
    image: {
      src: '/wp-content/uploads/2024/11/KT800-png.avif',
      srcset:
        '/wp-content/uploads/2024/11/KT800-png.avif 624w, /wp-content/uploads/2024/11/KT800-300x232.avif 300w',
      sizes: '(max-width: 624px) 100vw, 624px',
      width: 624,
      height: 483,
    },
    animation: 'fadeInRight',
    layout: 'stack-right',
  },
] as const;

export const PRODUCT_VIDEO = {
  src: '/wp-content/uploads/2023/12/SA8000-2023x264-x264-1.mp4',
} as const;

export interface GallerySlide {
  id: string;
  image: ResponsiveImage;
}

export const GALLERY_SLIDES: GallerySlide[] = [
  {
    id: 'g1',
    image: {
      src: '/wp-content/uploads/2024/11/7-png.avif',
      srcset: '/wp-content/uploads/2024/11/7-png.avif 737w, /wp-content/uploads/2024/11/7-300x209.avif 300w',
      sizes: '(max-width: 737px) 100vw, 737px',
      width: 737,
      height: 513,
    },
  },
  {
    id: 'g2',
    image: {
      src: '/wp-content/uploads/2024/11/8-png.avif',
      srcset: '/wp-content/uploads/2024/11/8-png.avif 737w, /wp-content/uploads/2024/11/8-300x209.avif 300w',
      sizes: '(max-width: 737px) 100vw, 737px',
      width: 737,
      height: 513,
    },
  },
  {
    id: 'g3',
    image: {
      src: '/wp-content/uploads/2024/11/9-png.avif',
      srcset: '/wp-content/uploads/2024/11/9-png.avif 737w, /wp-content/uploads/2024/11/9-300x209.avif 300w',
      sizes: '(max-width: 737px) 100vw, 737px',
      width: 737,
      height: 513,
    },
  },
  {
    id: 'g4',
    image: {
      src: '/wp-content/uploads/2024/11/10-png.avif',
      srcset: '/wp-content/uploads/2024/11/10-png.avif 737w, /wp-content/uploads/2024/11/10-300x209.avif 300w',
      sizes: '(max-width: 737px) 100vw, 737px',
      width: 737,
      height: 513,
    },
  },
  {
    id: 'g5',
    image: {
      src: '/wp-content/uploads/2024/11/11-png.avif',
      srcset: '/wp-content/uploads/2024/11/11-png.avif 737w, /wp-content/uploads/2024/11/11-300x209.avif 300w',
      sizes: '(max-width: 737px) 100vw, 737px',
      width: 737,
      height: 513,
    },
  },
  {
    id: 'g6',
    image: {
      src: '/wp-content/uploads/2024/11/12-png.avif',
      srcset: '/wp-content/uploads/2024/11/12-png.avif 737w, /wp-content/uploads/2024/11/12-300x209.avif 300w',
      sizes: '(max-width: 737px) 100vw, 737px',
      width: 737,
      height: 513,
    },
  },
  {
    id: 'g7',
    image: {
      src: '/wp-content/uploads/2024/11/13-png.avif',
      srcset: '/wp-content/uploads/2024/11/13-png.avif 737w, /wp-content/uploads/2024/11/13-300x209.avif 300w',
      sizes: '(max-width: 737px) 100vw, 737px',
      width: 737,
      height: 513,
    },
  },
] as const;

export const GALLERY_SECTION = {
  title: 'Gallery',
  titleImage: {
    src: '/wp-content/uploads/2024/03/图层-1421.png',
    srcset:
      '/wp-content/uploads/2024/03/图层-1421.png 608w, /wp-content/uploads/2024/03/图层-1421-300x53.png 300w',
    sizes: '(max-width: 608px) 100vw, 608px',
    width: 608,
    height: 107,
    alt: '',
  },
} as const;
