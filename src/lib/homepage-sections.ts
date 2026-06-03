import { normalizeMirrorHtml } from './mirror-urls';

const HOME_MAIN_OPEN =
  '<main id="content" class="site-main post-2 page type-page status-publish hentry">';
const HOME_PAGE_WRAPPER_OPEN = '<div class="page-content">';
const HOME_ELEMENTOR_OPEN =
  '<div data-elementor-type="wp-page" data-elementor-id="2" class="elementor elementor-2" data-elementor-post-type="page">';

const HOME_SECTION_MARKERS = [
  { key: 'heroCarousel', startToken: '<div class="elementor-element elementor-element-9e1277b' },
  { key: 'auxiliaryHtml', startToken: '<div class="elementor-element elementor-element-44129e3' },
  { key: 'productHero', startToken: '<div class="elementor-element elementor-element-872d0e5' },
  { key: 'productIntro', startToken: '<div class="elementor-element elementor-element-d4d8d65' },
  { key: 'productGrid', startToken: '<div class="elementor-element elementor-element-68ca544' },
  { key: 'productVideo', startToken: '<div class="elementor-element elementor-element-b37a4e1' },
  { key: 'remainder', startToken: '<div class="elementor-element elementor-element-94c2452' },
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_MARKERS)[number]['key'];

export type HomePageSections = Record<HomeSectionKey, string>;

function sliceBetween(source: string, startToken: string, endToken?: string): string {
  const startIndex = source.indexOf(startToken);
  if (startIndex === -1) return '';

  const endIndex = endToken ? source.indexOf(endToken, startIndex) : source.length;
  const raw = source.slice(startIndex, endIndex === -1 ? source.length : endIndex).trim();
  return normalizeMirrorHtml(raw);
}

export function extractHomePageSections(html: string): HomePageSections {
  const firstStart = html.indexOf(HOME_SECTION_MARKERS[0].startToken);
  const mainEnd = html.lastIndexOf('</main>');
  const source = html.slice(firstStart === -1 ? 0 : firstStart, mainEnd === -1 ? html.length : mainEnd);

  const sections = {} as HomePageSections;

  for (const [index, marker] of HOME_SECTION_MARKERS.entries()) {
    const next = HOME_SECTION_MARKERS[index + 1];
    sections[marker.key] = sliceBetween(source, marker.startToken, next?.startToken);
  }

  return sections;
}

export const HOME_PAGE_WRAPPER = {
  mainOpen: HOME_MAIN_OPEN,
  pageWrapperOpen: HOME_PAGE_WRAPPER_OPEN,
  elementorOpen: HOME_ELEMENTOR_OPEN,
} as const;
