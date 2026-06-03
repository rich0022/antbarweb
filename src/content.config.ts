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

const articleSchema = z.object({
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
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: articleSchema,
});

const review = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/review' }),
  schema: articleSchema,
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: articleSchema.extend({
    family: z.enum(['disposable', 'pod-sys']),
    kind: z.enum(['category', 'detail']).default('detail'),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional().default(''),
    description: z.string().optional(),
    order: z.number().optional(),
    seo: seoSchema,
    sections: z.array(sectionSchema).optional(),
  }),
});

export const collections = { blog, review, products, pages };
