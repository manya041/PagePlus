import * as cheerio from 'cheerio';

export interface ParsedHtmlMetrics {
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1Count: number;
  h1List: string[];
  missingAltImages: number;
  totalImages: number;
  missingAltDetails: Array<{ src: string; altText: string }>;
  wordCount: number;
  readingTimeMinutes: number;
  contentDepth: 'Thin' | 'Moderate' | 'Comprehensive';
}

export function parseHtmlContent(html: string): ParsedHtmlMetrics {
  const $ = cheerio.load(html);

  // 1. Page Title
  const rawTitle = $('title').first().text().trim();
  const title = rawTitle ? rawTitle : null;
  const titleLength = title ? title.length : 0;

  // 2. Meta Description
  let metaDesc = $('meta[name="description" i]').attr('content')?.trim() || null;
  if (!metaDesc) {
    metaDesc = $('meta[property="og:description" i]').attr('content')?.trim() || null;
  }
  const metaDescription = metaDesc ? metaDesc : null;
  const metaDescriptionLength = metaDescription ? metaDescription.length : 0;

  // 3. H1 Count & Text List
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const h1List: string[] = [];
  h1Elements.each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) {
      h1List.push(text);
    }
  });

  // 4. Images Missing Alt Text
  const images = $('img');
  const totalImages = images.length;
  let missingAltImages = 0;
  const missingAltDetails: Array<{ src: string; altText: string }> = [];

  images.each((_, el) => {
    const alt = $(el).attr('alt');
    const src = $(el).attr('src') || $(el).attr('data-src') || 'Unknown src';
    
    // Alt is missing or empty string
    if (alt === undefined || alt === null || alt.trim() === '') {
      missingAltImages++;
      if (missingAltDetails.length < 10) {
        missingAltDetails.push({
          src: src.length > 80 ? src.substring(0, 77) + '...' : src,
          altText: alt === undefined ? '(attribute missing)' : '(empty string)'
        });
      }
    }
  });

  // 5. Approximate Word Count
  // Clone body to avoid mutating original, remove noise tags
  const bodyClone = $('body').clone();
  bodyClone.find('script, style, noscript, svg, iframe, header, footer, nav, code, style').remove();
  
  const textContent = bodyClone.text().replace(/\s+/g, ' ').trim();
  const words = textContent.length > 0 ? textContent.split(/\s+/).filter(word => word.length > 0) : [];
  const wordCount = words.length;

  // Reading time (avg 200 words/min)
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  // Content depth classification
  let contentDepth: 'Thin' | 'Moderate' | 'Comprehensive' = 'Thin';
  if (wordCount > 1000) {
    contentDepth = 'Comprehensive';
  } else if (wordCount > 300) {
    contentDepth = 'Moderate';
  }

  return {
    title,
    titleLength,
    metaDescription,
    metaDescriptionLength,
    h1Count,
    h1List,
    missingAltImages,
    totalImages,
    missingAltDetails,
    wordCount,
    readingTimeMinutes,
    contentDepth
  };
}
