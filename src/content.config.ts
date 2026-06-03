import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    canonical: z.string().optional(),
  })
  .optional();

const sectionSchema = z
  .object({
    type: z.enum(['hero', 'richtext', 'spec-table', 'media']),
    title: z.string().optional(),
    content: z.string().optional(),
    html: z.string().optional(),
    mediaUrl: z.string().optional(),
    mediaAlt: z.string().optional(),
    rows: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  })
  .optional();

// ── Blog ──────────────────────────────────────────────────────────────────────
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional().default(''),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    publishedAt: z.string().optional(),
    updatedAt: z.string().optional(),
    order: z.number().optional(),
    author: z.string().optional(),
    featuredImage: z.string().optional(),
    heroImage: z.string().optional(),
    category: z.string().optional(),
    readTime: z.string().optional(),
    tags: z.array(z.string()).default([]),
    seo: seoSchema,
    sections: z.array(sectionSchema).optional(),
    /** Raw mirrored HTML body — fallback during transition. */
    body: z.string().optional(),
  }),
});

// ── Review ────────────────────────────────────────────────────────────────────
const review = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/review' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional().default(''),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    publishedAt: z.string().optional(),
    updatedAt: z.string().optional(),
    order: z.number().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    seo: seoSchema,
    sections: z.array(sectionSchema).optional(),
    /** Review-specific fields */
    productName: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
    verdict: z.string().optional(),
    /** Raw mirrored HTML body — fallback during transition. */
    body: z.string().optional(),
  }),
});

// ── Products ──────────────────────────────────────────────────────────────────
const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional().default(''),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    publishedAt: z.string().optional(),
    updatedAt: z.string().optional(),
    order: z.number().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    seo: seoSchema,
    sections: z.array(sectionSchema).optional(),
    /** Product family — which top-level category. */
    family: z.enum(['disposable', 'pod-sys']),
    /** kind: 'category' for index pages, 'detail' for individual products. */
    kind: z.enum(['category', 'detail']).default('detail'),
    /** Product-specific structured fields */
    productName: z.string(),
    puffCount: z.string().optional(),
    nicotineStrength: z.string().optional(),
    flavors: z.array(z.string()).optional(),
    batteryCapacity: z.string().optional(),
    features: z.array(z.string()).optional(),
    gallery: z.array(z.string()).optional(),
    specsTable: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .optional(),
    /** Raw mirrored HTML body — fallback during transition. */
    body: z.string().optional(),
  }),
});

// ── Pages ─────────────────────────────────────────────────────────────────────
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional().default(''),
    description: z.string().optional(),
    order: z.number().optional(),
    seo: seoSchema,
    sections: z.array(sectionSchema).optional(),
    /** Page-specific structured fields */
    template: z
      .enum(['default', 'hero', 'contact', 'full-width'])
      .optional()
      .default('default'),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroImage: z.string().optional(),
    /** Raw mirrored HTML body — fallback during transition. */
    body: z.string().optional(),
  }),
});

export const collections = { blog, review, products, pages };
