/** Site chrome link model — keep URLs in sync with mirror routes. */

export const ELEMENTOR_POPUP_MOBILE_MENU =
  '#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjI5NzgiLCJ0b2dnbGUiOnRydWV9';

export const ELEMENTOR_POPUP_SEARCH =
  '#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjExMzIiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D';

export const HEADER_WARNING_TEXT =
  'WARNING: This product contains nicotine. Nicotine is an addictive chemical. For ADULT use only.';

export const SITE_LOGO = {
  href: '/',
  src: '/wp-content/uploads/2024/05/LOGO.png',
  width: 307,
  height: 78,
  alt: 'best disposable vape brand near you',
  srcset: '/wp-content/uploads/2024/05/LOGO.png 307w, /wp-content/uploads/2024/05/LOGO-300x76.png 300w',
  sizes: '(max-width: 307px) 100vw, 307px',
  imageClass: 'attachment-full size-full wp-image-2958',
};

export const HEADER_SEARCH_ICON = {
  href: ELEMENTOR_POPUP_SEARCH,
  src: '/wp-content/uploads/2023/12/1-2.png',
  width: 40,
  height: 40,
  imageClass: 'attachment-full size-full wp-image-1805',
};

export { MEGA_MENU_WIDGET_SETTINGS } from './mega-menu-settings';

export const MEGA_MENU_WIDGET_NUMBER = 139;

export type NavLink = { label: string; href: string };

export type MegaMenuItem = {
  label: string;
  href: string;
  menuItemId: string;
  tabIndex: number;
  dropdown: boolean;
  panel?: 'products' | 'links';
  links?: NavLink[];
};

export const PRIMARY_NAV: MegaMenuItem[] = [
  { label: 'Home', href: '/', menuItemId: '1391', tabIndex: 1, dropdown: false },
  {
    label: 'Products',
    href: '/all-products/',
    menuItemId: '1392',
    tabIndex: 2,
    dropdown: true,
    panel: 'products',
  },
  {
    label: 'About',
    href: '/about-us/',
    menuItemId: '1393',
    tabIndex: 3,
    dropdown: true,
    panel: 'links',
    links: [
      { label: 'Brand Story', href: '/brand-story/' },
      { label: 'R&D Center', href: '/rd-center/' },
      { label: 'Antbar Lab', href: '/antbar-lab/' },
      { label: 'Intelligent Manufacturing', href: '/intelligent-manufacturing/' },
    ],
  },
  {
    label: 'Community',
    href: '/blog/',
    menuItemId: '1394',
    tabIndex: 4,
    dropdown: true,
    panel: 'links',
    links: [
      { label: 'Blog', href: '/blog/' },
      { label: 'Review', href: '/review/' },
    ],
  },
  { label: 'Contact', href: '/contact/', menuItemId: '1395', tabIndex: 5, dropdown: false },
  {
    label: 'Support',
    href: '/support/',
    menuItemId: '1396',
    tabIndex: 6,
    dropdown: true,
    panel: 'links',
    links: [
      { label: 'FAQ', href: '/support/' },
      { label: 'Verification', href: '/verification/' },
    ],
  },
];

export const PRODUCT_MEGA_TILES = [
  {
    href: '/disposable/',
    src: '/wp-content/uploads/2023/12/Product2540宽，版心1200-08.png',
    width: 151,
    height: 151,
    imageClass: 'attachment-full size-full wp-image-1173',
    caption: 'Disposable',
    containerId: '8137448',
    imageWidgetId: '76fef2c',
  },
  {
    href: '/pod-sys/',
    src: '/wp-content/uploads/2023/12/Product2540宽，版心1200-13.png',
    width: 151,
    height: 151,
    imageClass: 'attachment-full size-full wp-image-1178',
    caption: 'Closed Pod System',
    containerId: '19fe63d',
    imageWidgetId: '5edbb06',
  },
] as const;

export type FooterAccordionSection = {
  detailsId: string;
  accordionIndex: number;
  title: string;
  rows: { label: string; href: string }[];
};

export const FOOTER_MOBILE_ACCORDION: FooterAccordionSection[] = [
  {
    detailsId: 'e-n-accordion-item-5030',
    accordionIndex: 1,
    title: 'About',
    rows: [
      { label: 'Brand Story', href: '/brand-story/' },
      { label: 'R&D Center', href: '/rd-center/' },
      { label: 'Antbar Lab', href: '/antbar-lab/' },
      { label: 'Intelligent Manufacturing', href: '/intelligent-manufacturing/' },
    ],
  },
  {
    detailsId: 'e-n-accordion-item-5031',
    accordionIndex: 2,
    title: 'Community',
    rows: [
      { label: 'Blog', href: '/blog/' },
      { label: 'Review', href: '/review/' },
    ],
  },
  {
    detailsId: 'e-n-accordion-item-5032',
    accordionIndex: 3,
    title: 'Support',
    rows: [
      { label: 'Faq', href: '/support/' },
      { label: 'Verification', href: '/verification/' },
    ],
  },
];

export type FooterColumn = { title: string; links: NavLink[] };

export const FOOTER_DESKTOP_COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Disposable', href: '/disposable/' },
      { label: 'Closed Pod System', href: '/pod-sys/' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Brand Story', href: '/brand-story/' },
      { label: 'R&D Center', href: '/rd-center/' },
      { label: 'Antbar Lab', href: '/antbar-lab/' },
      { label: 'Intelligent Manufacturing', href: '/intelligent-manufacturing/' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Blog', href: '/blog/' },
      { label: 'Review', href: '/review/' },
    ],
  },
];

export const FOOTER_SOCIAL = [
  {
    label: 'Facebook-f',
    href: 'https://www.facebook.com/profile.php?id=100094221171904',
    iconClass: 'e-fab-facebook-f',
    repeaterClass: 'elementor-repeater-item-a799693',
  },
  {
    label: 'Vk',
    href: 'https://vk.com/smoantbar',
    iconClass: 'e-fab-vk',
    repeaterClass: 'elementor-repeater-item-8194cd4',
  },
  {
    label: 'Play',
    href: 'https://www.youtube.com/@Antbar_official',
    iconClass: 'e-fas-play',
    repeaterClass: 'elementor-repeater-item-6a287a9',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/antbar_official/',
    iconClass: 'e-fab-instagram',
    repeaterClass: 'elementor-repeater-item-82fbc76',
  },
] as const;

export const FOOTER_COPYRIGHT = 'Copyright © 2026 ANTBAR. All rights reserved.';
