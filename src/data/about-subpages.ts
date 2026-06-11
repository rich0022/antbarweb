interface ResponsiveImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
}

interface SubpageHero {
  heroClass: string;
  desktopImage: ResponsiveImage;
  mobileImage: ResponsiveImage;
  overlay?: {
    headings: readonly [string, string];
  };
}

export const BRAND_STORY_HERO: SubpageHero = {
  heroClass: 'scroll-bn',
  desktopImage: {
    src: '/wp-content/uploads/2024/11/brand-story-1-scaled-1.avif',
    srcset: '/wp-content/uploads/2024/11/brand-story-1-scaled-1.avif 2560w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-300x146.avif 300w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-1024x500.avif 1024w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-768x375.avif 768w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-1536x749.avif 1536w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-2048x999.avif 2048w',
    sizes: '(max-width: 2560px) 100vw, 2560px',
    width: 2560,
    height: 1249,
  },
  mobileImage: {
    src: '/wp-content/uploads/2024/11/brand-story.avif',
    srcset: '/wp-content/uploads/2024/11/brand-story.avif 1170w, /wp-content/uploads/2024/11/brand-story-182x300.avif 182w, /wp-content/uploads/2024/11/brand-story-620x1024.avif 620w, /wp-content/uploads/2024/11/brand-story-768x1268.avif 768w, /wp-content/uploads/2024/11/brand-story-931x1536.avif 931w',
    sizes: '(max-width: 1170px) 100vw, 1170px',
    width: 1170,
    height: 1931,
  },
  overlay: {
    headings: ['TO EXPLORE', 'TO EXPERIENCE'],
  },
};

export const BRAND_STORY_HERO_SECTION_WIDGETS = {
  iconSrc: '/wp-content/uploads/2024/11/icon-1-png.avif',
  iconWidth: 91,
  iconHeight: 30,
  text: `Antbar is a new e-cigarette brand launched by Cloupor Group. Adhering to the concept of "User First", Antbar develops a series of versatile products with disposable, replaceable, and multi-functional features to accurately meets the demand of the majority of users.<br>In 2013, Cloupor was founded in Shenzhen with headquarters in Humen, Dongguan, which is a technology-based company specializing in the design and development of electronic atomizer products and intelligent manufacturing OEM services.`,
} as const;

export const BRAND_STORY_GALLERY_IMAGES = [
  { src: '/wp-content/uploads/2024/11/brand-story-3.avif', srcset: '/wp-content/uploads/2024/11/brand-story-3.avif 958w, /wp-content/uploads/2024/11/brand-story-3-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-3-768x612.avif 768w', width: 958, height: 764, active: false },
  { src: '/wp-content/uploads/2024/11/brand-story-4.avif', srcset: '/wp-content/uploads/2024/11/brand-story-4.avif 958w, /wp-content/uploads/2024/11/brand-story-4-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-4-768x612.avif 768w', width: 958, height: 764, active: false },
  { src: '/wp-content/uploads/2024/11/brand-story-5.avif', srcset: '/wp-content/uploads/2024/11/brand-story-5.avif 958w, /wp-content/uploads/2024/11/brand-story-5-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-5-768x612.avif 768w', width: 958, height: 764, active: false },
  { src: '/wp-content/uploads/2024/11/brand-story-6.avif', srcset: '/wp-content/uploads/2024/11/brand-story-6.avif 958w, /wp-content/uploads/2024/11/brand-story-6-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-6-768x612.avif 768w', width: 958, height: 764, active: false },
  { src: '/wp-content/uploads/2024/11/brand-story5.avif', srcset: '/wp-content/uploads/2024/11/brand-story5.avif 958w, /wp-content/uploads/2024/11/brand-story5-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story5-768x612.avif 768w', width: 958, height: 764, active: true },
] as const;

export const BRAND_STORY_FINAL = {
  image: {
    src: '/wp-content/uploads/2024/11/brand-story-2.avif',
    srcset: '/wp-content/uploads/2024/11/brand-story-2.avif 1913w, /wp-content/uploads/2024/11/brand-story-2-300x169.avif 300w, /wp-content/uploads/2024/11/brand-story-2-1024x576.avif 1024w, /wp-content/uploads/2024/11/brand-story-2-768x432.avif 768w, /wp-content/uploads/2024/11/brand-story-2-1536x864.avif 1536w',
    sizes: '(max-width: 1913px) 100vw, 1913px',
    width: 1913,
    height: 1076,
  },
  text: 'Adhering to scientific and technological innovation and market-oriented, our products are widely sold in dozens of countries and regions around the world. With its excellent technical strength and market competitiveness, Antbar has won recognition and praise from a large number of enterprises, distributors, and consumers at home and abroad.',
} as const;

export const ANTBAR_LAB_HERO: SubpageHero = {
  heroClass: 'scroll-bn',
  desktopImage: {
    src: '/wp-content/uploads/2024/04/ANTBAR-LAB-1.avif',
    srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-1.avif 1920w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-300x146.webp 300w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-1024x499.avif 1024w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-768x374.webp 768w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-1536x749.avif 1536w',
    sizes: '(max-width: 1920px) 100vw, 1920px',
    width: 1920,
    height: 936,
  },
  mobileImage: {
    src: '/wp-content/uploads/2024/05/antbar-lab.avif',
    srcset: '/wp-content/uploads/2024/05/antbar-lab.avif 1170w, /wp-content/uploads/2024/05/antbar-lab-182x300.webp 182w, /wp-content/uploads/2024/05/antbar-lab-620x1024.avif 620w, /wp-content/uploads/2024/05/antbar-lab-768x1268.avif 768w, /wp-content/uploads/2024/05/antbar-lab-931x1536.avif 931w',
    sizes: '(max-width: 1170px) 100vw, 1170px',
    width: 1170,
    height: 1931,
  },
};

export const ANTBAR_LAB_INTRO = {
  iconWidth: 91,
  iconHeight: 30,
  leftImage: {
    src: '/wp-content/uploads/2024/04/ANTBAR-LAB-2.avif',
    srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-2.avif 1426w, /wp-content/uploads/2024/04/ANTBAR-LAB-2-300x218.webp 300w, /wp-content/uploads/2024/04/ANTBAR-LAB-2-1024x743.avif 1024w, /wp-content/uploads/2024/04/ANTBAR-LAB-2-768x557.avif 768w',
    sizes: '(max-width: 1426px) 100vw, 1426px',
    width: 1426,
    height: 1034,
  },
  rightImage: {
    src: '/wp-content/uploads/2024/04/ANTBAR-LAB-3.avif',
    srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-3.avif 709w, /wp-content/uploads/2024/04/ANTBAR-LAB-3-237x300.webp 237w',
    sizes: '(max-width: 709px) 100vw, 709px',
    width: 709,
    height: 897,
  },
  rightText: 'With R&D and development strength, Antbar builds a professional lab and experienced team with advanced automatic production equipment, and a comprehensive production process.',
  bottomHeading: 'Antbar Lab',
  bottomText: 'With excellent R&D and development strength, Antbar sets up a professional lab to control the quality of our products, which is led by our experienced scientific research team with advanced automatic production equipment, and a comprehensive production process.',
} as const;

export const ANTBAR_LAB_CERTS = {
  heading: 'Authentication<br>\nCertificate',
  text: "Antbar's products are manufactured in Class 100,000 cleanrooms in line with FDA standards, 7S workplace standard and GMP standard. The products are strictly checked by QC, FQC, PQC, QA, SQE, QE and other quality inspection before formal pro- duction, ensuring only 100% qualified products entering the market.",
  certs: [
    { src: '/wp-content/uploads/2024/04/ANTBAR-LAB-4.avif', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-4.avif 549w, /wp-content/uploads/2024/04/ANTBAR-LAB-4-228x300.webp 228w', width: 549, height: 723 },
    { src: '/wp-content/uploads/2024/04/ANTBAR-LAB-5.avif', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-5.avif 549w, /wp-content/uploads/2024/04/ANTBAR-LAB-5-228x300.webp 228w', width: 549, height: 723 },
    { src: '/wp-content/uploads/2024/04/ANTBAR-LAB-6.avif', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-6.avif 549w, /wp-content/uploads/2024/04/ANTBAR-LAB-6-228x300.webp 228w', width: 549, height: 723 },
  ],
} as const;
