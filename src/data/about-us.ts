export interface AboutSection {
  heading: string;
  text: string;
  buttonHref: string;
  image: {
    src: string;
    srcset: string;
    sizes: string;
    width: number;
    height: number;
    wpImageId: number;
  };
  sectionContainerId: string;
  imageContainerId: string;
  imageWidgetId: string;
  textContainerId: string;
  headingWidgetId: string;
  textWidgetId: string;
  buttonWidgetId: string;
}

export const ABOUT_HERO = {
  desktopImage: {
    src: '/wp-content/uploads/2024/04/ABOUT-1.jpg',
    srcset:
      '/wp-content/uploads/2024/04/ABOUT-1.jpg 1920w, /wp-content/uploads/2024/04/ABOUT-1-300x146.jpg 300w, /wp-content/uploads/2024/04/ABOUT-1-1024x499.jpg 1024w, /wp-content/uploads/2024/04/ABOUT-1-768x374.jpg 768w, /wp-content/uploads/2024/04/ABOUT-1-1536x749.jpg 1536w',
    sizes: '(max-width: 1920px) 100vw, 1920px',
    width: 1920,
    height: 936,
  },
  mobileImage: {
    src: '/wp-content/uploads/2024/05/ABOUT-US.jpg',
    srcset:
      '/wp-content/uploads/2024/05/ABOUT-US.jpg 1170w, /wp-content/uploads/2024/05/ABOUT-US-182x300.jpg 182w, /wp-content/uploads/2024/05/ABOUT-US-620x1024.jpg 620w, /wp-content/uploads/2024/05/ABOUT-US-768x1268.jpg 768w, /wp-content/uploads/2024/05/ABOUT-US-931x1536.jpg 931w',
    sizes: '(max-width: 1170px) 100vw, 1170px',
    width: 1170,
    height: 1931,
  },
  headings: ['TO EXPLORE', 'TO EXPERIENCE'] as const,
  containerDataId: '1ad28d8',
  imageContainerId: 'eac586e',
  desktopWidgetId: 'd64b6c4',
  mobileWidgetId: '9837a5a',
  overlayContainerId: '71bdaa9',
  overlayInnerId: '06732d4',
  headingWidget1Id: '5625704',
  headingWidget2Id: '7b330de',
  scriptWidgetId: '3edfae7',
} as const;

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    heading: 'Brand story',
    text: 'Antbar is a new e-cigarette brand launched by Cloupor Group. Adhering to the concept of "User First", Antbar develops a series of versatile products with disposable, replaceable, and multi-functional features to accurately meets the demand of the majority of users.',
    buttonHref: '/brand-story/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-2.jpg',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-2.jpg 867w, /wp-content/uploads/2024/04/ABOUT-2-232x300.jpg 232w, /wp-content/uploads/2024/04/ABOUT-2-793x1024.jpg 793w, /wp-content/uploads/2024/04/ABOUT-2-768x991.jpg 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
      wpImageId: 2068,
    },
    sectionContainerId: 'da2f5cc',
    imageContainerId: 'fe96b8e',
    imageWidgetId: '2791c3c',
    textContainerId: '6c75adc',
    headingWidgetId: 'b0089db',
    textWidgetId: '02ba8c2',
    buttonWidgetId: '8babd59',
  },
  {
    heading: 'Antbar Lab',
    text: 'With excellent R&D and development strength, Antbar set up a specific lab to ensure the quality of our products, supported by a professional scientific research team, advanced auto-matic production equipment, and a complete production process.',
    buttonHref: '/antbar-lab/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-3.jpg',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-3.jpg 867w, /wp-content/uploads/2024/04/ABOUT-3-232x300.jpg 232w, /wp-content/uploads/2024/04/ABOUT-3-793x1024.jpg 793w, /wp-content/uploads/2024/04/ABOUT-3-768x991.jpg 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
      wpImageId: 2069,
    },
    sectionContainerId: '000fa24',
    imageContainerId: '338ed0c',
    imageWidgetId: '496436f',
    textContainerId: 'c9f60b6',
    headingWidgetId: '135fcb2',
    textWidgetId: 'acadb6e',
    buttonWidgetId: '71813f9',
  },
  {
    heading: 'Intelligent\nManufacturing',
    text: 'Our factory uses real-time data analysis, artificial intelligence (AI), and machine learning in the manufacturing process to realize intelligent manufacturing. The self-developed auto-mated plant improves both production efficiency and costre-duction. The state-of-the-art vape automated production line has encompassed a comprehensive range of processes,which include bracket and silicone assembly, welding heating wire, oil guide cotton inspection, automated e-liquid filling,and functional testing.',
    buttonHref: '/intelligent-manufacturing/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-4.jpg',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-4.jpg 867w, /wp-content/uploads/2024/04/ABOUT-4-232x300.jpg 232w, /wp-content/uploads/2024/04/ABOUT-4-793x1024.jpg 793w, /wp-content/uploads/2024/04/ABOUT-4-768x991.jpg 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
      wpImageId: 2070,
    },
    sectionContainerId: '1555338',
    imageContainerId: 'd885159',
    imageWidgetId: '5fd8712',
    textContainerId: '5559e9a',
    headingWidgetId: '6ae0aac',
    textWidgetId: '426fd8f',
    buttonWidgetId: 'bffb752',
  },
  {
    heading: 'R&D Center',
    text: 'Antbar spare no expense and effort in research and develop-ment. Driven by market-oriented and technological innovation, we build up a strong scientific re-search and technology team supported by advanced scientific equipmen',
    buttonHref: '/rd-center/',
    image: {
      src: '/wp-content/uploads/2024/04/ABOUT-5.jpg',
      srcset:
        '/wp-content/uploads/2024/04/ABOUT-5.jpg 867w, /wp-content/uploads/2024/04/ABOUT-5-232x300.jpg 232w, /wp-content/uploads/2024/04/ABOUT-5-793x1024.jpg 793w, /wp-content/uploads/2024/04/ABOUT-5-768x991.jpg 768w',
      sizes: '(max-width: 867px) 100vw, 867px',
      width: 867,
      height: 1119,
      wpImageId: 2071,
    },
    sectionContainerId: '043af62',
    imageContainerId: '9d5efb8',
    imageWidgetId: 'f23ad8d',
    textContainerId: 'f295ff3',
    headingWidgetId: 'fb214bf',
    textWidgetId: '61b814d',
    buttonWidgetId: 'd6bd049',
  },
] as const;
