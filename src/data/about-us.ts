export interface ResponsiveImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
}

export interface AboutSection {
  heading: string;
  text: string;
  buttonHref: string;
  image: ResponsiveImage;
}

export const ABOUT_HERO = {
  desktopImage: {
    src: '/wp-content/uploads/2024/04/ABOUT-1.avif',
    srcset:
      '/wp-content/uploads/2024/04/ABOUT-1.avif 1920w, /wp-content/uploads/2024/04/ABOUT-1-300x146.webp 300w, /wp-content/uploads/2024/04/ABOUT-1-1024x499.avif 1024w, /wp-content/uploads/2024/04/ABOUT-1-768x374.webp 768w, /wp-content/uploads/2024/04/ABOUT-1-1536x749.avif 1536w',
    sizes: '(max-width: 1920px) 100vw, 1920px',
    width: 1920,
    height: 936,
  },
  mobileImage: {
    src: '/wp-content/uploads/2024/05/ABOUT-US.avif',
    srcset:
      '/wp-content/uploads/2024/05/ABOUT-US.avif 1170w, /wp-content/uploads/2024/05/ABOUT-US-182x300.webp 182w, /wp-content/uploads/2024/05/ABOUT-US-620x1024.avif 620w, /wp-content/uploads/2024/05/ABOUT-US-768x1268.avif 768w, /wp-content/uploads/2024/05/ABOUT-US-931x1536.avif 931w',
    sizes: '(max-width: 1170px) 100vw, 1170px',
    width: 1170,
    height: 1931,
  },
  headings: ['TO EXPLORE', 'TO EXPERIENCE'] as const,
} as const;

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    heading: 'Brand story',
    text: 'Antbar is a new e-cigarette brand launched by Cloupor Group. Adhering to the concept of "User First", Antbar develops a series of versatile products with disposable, replaceable, and multi-functional features to accurately meets the demand of the majority of users.',
    buttonHref: '/brand-story/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-2.avif',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-2.avif 867w, /wp-content/uploads/2024/04/ABOUT-2-232x300.webp 232w, /wp-content/uploads/2024/04/ABOUT-2-793x1024.avif 793w, /wp-content/uploads/2024/04/ABOUT-2-768x991.avif 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
    },
  },
  {
    heading: 'Antbar Lab',
    text: 'With excellent R&D and development strength, Antbar set up a specific lab to ensure the quality of our products, supported by a professional scientific research team, advanced auto-matic production equipment, and a complete production process.',
    buttonHref: '/antbar-lab/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-3.avif',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-3.avif 867w, /wp-content/uploads/2024/04/ABOUT-3-232x300.webp 232w, /wp-content/uploads/2024/04/ABOUT-3-793x1024.avif 793w, /wp-content/uploads/2024/04/ABOUT-3-768x991.avif 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
    },
  },
  {
    heading: 'Intelligent\nManufacturing',
    text: 'Our factory uses real-time data analysis, artificial intelligence (AI), and machine learning in the manufacturing process to realize intelligent manufacturing. The self-developed auto-mated plant improves both production efficiency and costre-duction. The state-of-the-art vape automated production line has encompassed a comprehensive range of processes,which include bracket and silicone assembly, welding heating wire, oil guide cotton inspection, automated e-liquid filling,and functional testing.',
    buttonHref: '/intelligent-manufacturing/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-4.avif',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-4.avif 867w, /wp-content/uploads/2024/04/ABOUT-4-232x300.webp 232w, /wp-content/uploads/2024/04/ABOUT-4-793x1024.avif 793w, /wp-content/uploads/2024/04/ABOUT-4-768x991.avif 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
    },
  },
  {
    heading: 'R&D Center',
    text: 'Antbar spare no expense and effort in research and develop-ment. Driven by market-oriented and technological innovation, we build up a strong scientific re-search and technology team supported by advanced scientific equipmen',
    buttonHref: '/rd-center/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-5.avif',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-5.avif 867w, /wp-content/uploads/2024/04/ABOUT-5-232x300.webp 232w, /wp-content/uploads/2024/04/ABOUT-5-793x1024.avif 793w, /wp-content/uploads/2024/04/ABOUT-5-768x991.avif 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
    },
  },
] as const;
