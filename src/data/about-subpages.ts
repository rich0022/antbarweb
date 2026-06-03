interface SubpageHero {
  heroClass: string;
  containerDataId: string;
  imageContainerId: string;
  desktopImage: {
    src: string; srcset: string; sizes: string; width: number; height: number; wpImageId: number;
  };
  desktopWidgetId: string;
  mobileImage: {
    src: string; srcset: string; sizes: string; width: number; height: number; wpImageId: number;
  };
  mobileWidgetId: string;
  overlay?: {
    containerDataId: string;
    innerContainerId: string;
    headingWidget1Id: string;
    headingWidget2Id: string;
    headings: readonly [string, string];
  };
}

export const BRAND_STORY_HERO: SubpageHero = {
  heroClass: 'scroll-bn',
  containerDataId: 'c97f29e',
  imageContainerId: 'e0c052d',
  desktopImage: {
    src: '/wp-content/uploads/2024/11/brand-story-1-scaled-1.avif',
    srcset: '/wp-content/uploads/2024/11/brand-story-1-scaled-1.avif 2560w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-300x146.avif 300w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-1024x500.avif 1024w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-768x375.avif 768w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-1536x749.avif 1536w, /wp-content/uploads/2024/11/brand-story-1-scaled-1-2048x999.avif 2048w',
    sizes: '(max-width: 2560px) 100vw, 2560px',
    width: 2560, height: 1249, wpImageId: 4845,
  },
  desktopWidgetId: 'e22d798',
  mobileImage: {
    src: '/wp-content/uploads/2024/11/brand-story.avif',
    srcset: '/wp-content/uploads/2024/11/brand-story.avif 1170w, /wp-content/uploads/2024/11/brand-story-182x300.avif 182w, /wp-content/uploads/2024/11/brand-story-620x1024.avif 620w, /wp-content/uploads/2024/11/brand-story-768x1268.avif 768w, /wp-content/uploads/2024/11/brand-story-931x1536.avif 931w',
    sizes: '(max-width: 1170px) 100vw, 1170px',
    width: 1170, height: 1931, wpImageId: 4846,
  },
  mobileWidgetId: 'bbbd6c2',
  overlay: {
    containerDataId: '3517b84',
    innerContainerId: 'a4e262e',
    headingWidget1Id: 'eeef0a5',
    headingWidget2Id: '18ac707',
    headings: ['TO EXPLORE', 'TO EXPERIENCE'],
  },
};

export const BRAND_STORY_HERO_SECTION_WIDGETS = {
  iconWidgetId: 'ae0f84c',
  iconSrc: '/wp-content/uploads/2024/11/icon-1-png.avif',
  iconWidth: 91, iconHeight: 30,
  headingWidgetId: 'c0356ea',
  textWidgetId: '8e16944',
  text: `Antbar is a new e-cigarette brand launched by Cloupor Group. Adhering to the concept of "User First", Antbar develops a series of versatile products with disposable, replaceable, and multi-functional features to accurately meets the demand of the majority of users.<br>In 2013, Cloupor was founded in Shenzhen with headquarters in Humen, Dongguan, which is a technology-based company specializing in the design and development of electronic atomizer products and intelligent manufacturing OEM services.`,
  containerDataId: '15378c3',
  innerContainerId: '4f1df62',
  leftColumnId: 'fc85106',
  rightColumnId: 'e78cc6d',
} as const;

export const BRAND_STORY_GALLERY_IMAGES = [
  { containerId: '17dfdd0', widgetId: '3b348f5', src: '/wp-content/uploads/2024/11/brand-story-3.avif', srcset: '/wp-content/uploads/2024/11/brand-story-3.avif 958w, /wp-content/uploads/2024/11/brand-story-3-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-3-768x612.avif 768w', width: 958, height: 764, active: false },
  { containerId: '17ab1e8', widgetId: '5a656fb', src: '/wp-content/uploads/2024/11/brand-story-4.avif', srcset: '/wp-content/uploads/2024/11/brand-story-4.avif 958w, /wp-content/uploads/2024/11/brand-story-4-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-4-768x612.avif 768w', width: 958, height: 764, active: false },
  { containerId: 'fb823a7', widgetId: '79c9a98', src: '/wp-content/uploads/2024/11/brand-story-5.avif', srcset: '/wp-content/uploads/2024/11/brand-story-5.avif 958w, /wp-content/uploads/2024/11/brand-story-5-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-5-768x612.avif 768w', width: 958, height: 764, active: false },
  { containerId: 'a46f358', widgetId: '7d39411', src: '/wp-content/uploads/2024/11/brand-story-6.avif', srcset: '/wp-content/uploads/2024/11/brand-story-6.avif 958w, /wp-content/uploads/2024/11/brand-story-6-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story-6-768x612.avif 768w', width: 958, height: 764, active: false },
  { containerId: 'f710ffe', widgetId: '359bf45', src: '/wp-content/uploads/2024/11/brand-story5.avif', srcset: '/wp-content/uploads/2024/11/brand-story5.avif 958w, /wp-content/uploads/2024/11/brand-story5-300x239.avif 300w, /wp-content/uploads/2024/11/brand-story5-768x612.avif 768w', width: 958, height: 764, active: true },
] as const;

export const BRAND_STORY_FINAL = {
  containerDataId: 'a88ac78',
  innerContainerId: '4d6a881',
  imageContainerId: '09fc9e7',
  imageWidgetId: '8fbecd1',
  textContainerId: '65f54fc',
  textWidgetId: 'a0d3988',
  image: {
    src: '/wp-content/uploads/2024/11/brand-story-2.avif',
    srcset: '/wp-content/uploads/2024/11/brand-story-2.avif 1913w, /wp-content/uploads/2024/11/brand-story-2-300x169.avif 300w, /wp-content/uploads/2024/11/brand-story-2-1024x576.avif 1024w, /wp-content/uploads/2024/11/brand-story-2-768x432.avif 768w, /wp-content/uploads/2024/11/brand-story-2-1536x864.avif 1536w',
    sizes: '(max-width: 1913px) 100vw, 1913px',
    width: 1913, height: 1076, wpImageId: 4858,
  },
  text: 'Adhering to scientific and technological innovation and market-oriented, our products are widely sold in dozens of countries and regions around the world. With its excellent technical strength and market competitiveness, Antbar has won recognition and praise from a large number of enterprises, distributors, and consumers at home and abroad.',
} as const;

// ---- Antbar Lab ----
export const ANTBAR_LAB_HERO: SubpageHero = {
  heroClass: 'scroll-bn',
  containerDataId: 'b778ff3',
  imageContainerId: '',
  desktopImage: {
    src: '/wp-content/uploads/2024/04/ANTBAR-LAB-1.jpg',
    srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-1.jpg 1920w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-300x146.jpg 300w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-1024x499.jpg 1024w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-768x374.jpg 768w, /wp-content/uploads/2024/04/ANTBAR-LAB-1-1536x749.jpg 1536w',
    sizes: '(max-width: 1920px) 100vw, 1920px',
    width: 1920, height: 936, wpImageId: 2059,
  },
  desktopWidgetId: '510cb9f',
  mobileImage: {
    src: '/wp-content/uploads/2024/05/antbar-lab.jpg',
    srcset: '/wp-content/uploads/2024/05/antbar-lab.jpg 1170w, /wp-content/uploads/2024/05/antbar-lab-182x300.jpg 182w, /wp-content/uploads/2024/05/antbar-lab-620x1024.jpg 620w, /wp-content/uploads/2024/05/antbar-lab-768x1268.jpg 768w, /wp-content/uploads/2024/05/antbar-lab-931x1536.jpg 931w',
    sizes: '(max-width: 1170px) 100vw, 1170px',
    width: 1170, height: 1931, wpImageId: 2988,
  },
  mobileWidgetId: 'e0839f1',
};

export const ANTBAR_LAB_INTRO = {
  containerDataId: '694d134', innerContainerId: '2e63208',
  leftColumnId: '30b12b2', leftInnerId: '4706e37', headingsContainerId: 'e006d72',
  heading1WidgetId: '0413914', heading2WidgetId: '937e0ce',
  iconContainerId: '0ca8573', iconWidgetId: '1b1e6b0', iconWidth: 91, iconHeight: 30,
  leftImageContainerId: '34effc4', leftImageWidgetId: 'a323651',
  leftImage: { src: '/wp-content/uploads/2024/04/ANTBAR-LAB-2.jpg', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-2.jpg 1426w, /wp-content/uploads/2024/04/ANTBAR-LAB-2-300x218.jpg 300w, /wp-content/uploads/2024/04/ANTBAR-LAB-2-1024x743.jpg 1024w, /wp-content/uploads/2024/04/ANTBAR-LAB-2-768x557.jpg 768w', sizes: '(max-width: 1426px) 100vw, 1426px', width: 1426, height: 1034, wpImageId: 2060 },
  rightColumnId: '60aed52', rightImageWidgetId: '8bd1c49',
  rightImage: { src: '/wp-content/uploads/2024/04/ANTBAR-LAB-3.jpg', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-3.jpg 709w, /wp-content/uploads/2024/04/ANTBAR-LAB-3-237x300.jpg 237w', sizes: '(max-width: 709px) 100vw, 709px', width: 709, height: 897, wpImageId: 2061 },
  rightTextWidgetId: 'a451449',
  rightText: 'With R&D and development strength, Antbar builds a professional lab and experienced team with advanced automatic production equipment, and a comprehensive production process.',
  bottomContainerId: 'f7495bb', headingWidgetId: 'b5a57b4', textWidgetId: '5d08e5b',
  bottomHeading: 'Antbar Lab',
  bottomText: 'With excellent R&D and development strength, Antbar sets up a professional lab to control the quality of our products, which is led by our experienced scientific research team with advanced automatic production equipment, and a comprehensive production process.',
} as const;

export const ANTBAR_LAB_CERTS = {
  containerDataId: 'f153d19', innerContainerId: '59eac70',
  headingWidgetId: 'a81265c', textWidgetId: 'b055248',
  heading: 'Authentication<br>\nCertificate',
  text: "Antbar's products are manufactured in Class 100,000 cleanrooms in line with FDA standards, 7S workplace standard and GMP standard. The products are strictly checked by QC, FQC, PQC, QA, SQE, QE and other quality inspection before formal pro- duction, ensuring only 100% qualified products entering the market.",
  imagesContainerId: 'fc45fad',
  certs: [
    { containerId: '40f2fe9', widgetId: 'e60190c', src: '/wp-content/uploads/2024/04/ANTBAR-LAB-4.jpg', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-4.jpg 549w, /wp-content/uploads/2024/04/ANTBAR-LAB-4-228x300.jpg 228w', width: 549, height: 723, wpImageId: 2062 },
    { containerId: '65be782', widgetId: 'c8135a9', src: '/wp-content/uploads/2024/04/ANTBAR-LAB-5.jpg', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-5.jpg 549w, /wp-content/uploads/2024/04/ANTBAR-LAB-5-228x300.jpg 228w', width: 549, height: 723, wpImageId: 2063 },
    { containerId: 'bd8dcdb', widgetId: '2ed6f1c', src: '/wp-content/uploads/2024/04/ANTBAR-LAB-6.jpg', srcset: '/wp-content/uploads/2024/04/ANTBAR-LAB-6.jpg 549w, /wp-content/uploads/2024/04/ANTBAR-LAB-6-228x300.jpg 228w', width: 549, height: 723, wpImageId: 2064 },
  ],
} as const;
