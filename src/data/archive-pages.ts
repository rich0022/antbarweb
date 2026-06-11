export type ArchivePageConfig = {
  hero: {
    desktopImage: string;
    mobileImage: string;
    heading: string;
    tagline: string;
  };
  featuredSlug: string;
};

export const BLOG_ARCHIVE_PAGE: ArchivePageConfig = {
  hero: {
    desktopImage: '/wp-content/uploads/2024/05/blog-1.avif',
    mobileImage: '/wp-content/uploads/2024/05/blog-2.avif',
    heading: 'BLOG',
    tagline: 'Learn more about the brand',
  },
  featuredSlug: 'do-disposable-e-cigarettes-need-a-total-ban',
};

export const REVIEW_ARCHIVE_PAGE: ArchivePageConfig = {
  hero: {
    desktopImage: '/wp-content/uploads/2024/05/review-1.avif',
    mobileImage: '/wp-content/uploads/2024/05/REVIEW-2.avif',
    heading: 'REVIEW',
    tagline: 'Learn more about the brand',
  },
  featuredSlug: 'antbar-rocket-disposable-vape-review',
};
