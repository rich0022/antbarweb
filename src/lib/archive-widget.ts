const WIDGET_MARKER = 'elementor-widget-posts';

export type ArchivePostCard = {
  articleClass: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageSrcSet?: string;
  imageSizes?: string;
  imageWidth?: string;
  imageHeight?: string;
  titleTag: string;
  titleHtml: string;
  readMoreText: string;
  readMoreAria?: string;
  dateText?: string;
};

export type ArchivePostsWidget = {
  widgetId?: string;
  widgetClass: string;
  dataId?: string;
  dataElementType?: string;
  dataSettings?: string;
  dataWidgetType?: string;
  postsContainerClass: string;
  skin: 'cards' | 'classic';
  cards: ArchivePostCard[];
  nextPageHref?: string;
  currentPage?: string;
  maxPage?: string;
  loadMoreText?: string;
};

export type ArchiveWidgetExtraction = {
  beforeHtml: string;
  widget: ArchivePostsWidget;
  afterHtml: string;
};

function getAttr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&#8230;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

function stripTags(value: string | undefined): string {
  return decodeHtmlEntities(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findWidgetStart(html: string): number {
  const markerIndex = html.indexOf(WIDGET_MARKER);
  if (markerIndex < 0) return -1;
  return html.lastIndexOf('<div', markerIndex);
}

function extractBalancedDiv(html: string, startIndex: number): { block: string; endIndex: number } | null {
  if (startIndex < 0) return null;

  const tagPattern = /<\/?div\b[^>]*>/gi;
  tagPattern.lastIndex = startIndex;
  let depth = 0;
  let started = false;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html))) {
    const tag = match[0];
    if (!started) {
      if (match.index !== startIndex || tag.startsWith('</')) return null;
      started = true;
      depth = 1;
      continue;
    }

    if (tag.startsWith('</')) depth -= 1;
    else depth += 1;

    if (depth === 0) {
      const endIndex = tagPattern.lastIndex;
      return { block: html.slice(startIndex, endIndex), endIndex };
    }
  }

  return null;
}

function parseCards(widgetBlock: string): ArchivePostCard[] {
  return [...widgetBlock.matchAll(/<article class="([^"]*)"[\s\S]*?role="listitem">([\s\S]*?)<\/article>/gi)].map(
    ([, articleClass, articleHtml]) => ({
      articleClass,
      href: articleHtml.match(/class="elementor-post__thumbnail__link" href="([^"]+)"/i)?.[1] ?? '',
      imageSrc: articleHtml.match(/<img[^>]*src="([^"]+)"/i)?.[1] ?? '',
      imageAlt: decodeHtmlEntities(articleHtml.match(/<img[^>]*alt="([^"]*)"/i)?.[1] ?? ''),
      imageSrcSet: articleHtml.match(/<img[^>]*srcset="([^"]+)"/i)?.[1],
      imageSizes: articleHtml.match(/<img[^>]*sizes="([^"]+)"/i)?.[1],
      imageWidth: articleHtml.match(/<img[^>]*width="([^"]+)"/i)?.[1],
      imageHeight: articleHtml.match(/<img[^>]*height="([^"]+)"/i)?.[1],
      titleTag: articleHtml.match(/<(h[1-6]) class="elementor-post__title">/i)?.[1]?.toLowerCase() ?? 'h2',
      titleHtml:
        articleHtml.match(/<h[1-6] class="elementor-post__title">\s*<a[^>]*>\s*([\s\S]*?)\s*<\/a>\s*<\/h[1-6]>/i)?.[1] ??
        '',
      readMoreText: stripTags(
        articleHtml.match(/class="elementor-post__read-more"[\s\S]*?>([\s\S]*?)<\/a>/i)?.[1],
      ),
      readMoreAria: stripTags(
        articleHtml.match(/class="elementor-post__read-more"[^>]*aria-label="([^"]+)"/i)?.[1],
      ),
      dateText: stripTags(articleHtml.match(/<span class="elementor-post-date">\s*([\s\S]*?)\s*<\/span>/i)?.[1]) || undefined,
    }),
  );
}

export function extractArchiveWidget(bodyHtml: string): ArchiveWidgetExtraction | null {
  const startIndex = findWidgetStart(bodyHtml);
  const extracted = extractBalancedDiv(bodyHtml, startIndex);
  if (!extracted) return null;

  const openTag = extracted.block.match(/^<div\b([^>]*)>/i)?.[0] ?? '';
  const postsContainerClass =
    extracted.block.match(/<div class="([^"]*elementor-posts-container[^"]*)" role="list">/i)?.[1] ??
    'elementor-posts-container elementor-posts elementor-grid';
  const nextPageHref = extracted.block.match(/data-next-page="([^"]+)"/i)?.[1];
  const currentPage = extracted.block.match(/data-page="([^"]+)"/i)?.[1];
  const maxPage = extracted.block.match(/data-max-page="([^"]+)"/i)?.[1];
  const loadMoreText = stripTags(
    extracted.block.match(/<span class="elementor-button-text">([\s\S]*?)<\/span>/i)?.[1],
  );

  return {
    beforeHtml: bodyHtml.slice(0, startIndex),
    afterHtml: bodyHtml.slice(extracted.endIndex),
    widget: {
      widgetId: getAttr(openTag, 'id'),
      widgetClass: getAttr(openTag, 'class') ?? '',
      dataId: getAttr(openTag, 'data-id'),
      dataElementType: getAttr(openTag, 'data-element_type'),
      dataSettings: decodeHtmlEntities(getAttr(openTag, 'data-settings') ?? ''),
      dataWidgetType: getAttr(openTag, 'data-widget_type'),
      postsContainerClass,
      skin: postsContainerClass.includes('elementor-posts--skin-cards') ? 'cards' : 'classic',
      cards: parseCards(extracted.block),
      nextPageHref,
      currentPage,
      maxPage,
      loadMoreText,
    },
  };
}
