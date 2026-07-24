import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../server';
import { parseHtmlContent } from '../parsers/htmlParser';
import { normalizeAndValidateUrl } from '../utils/urlValidator';

describe('PagePulse URL Validator Unit Tests', () => {
  it('should validate and normalize valid domains', () => {
    const res = normalizeAndValidateUrl('apple.com');
    expect(res.isValid).toBe(true);
    expect(res.normalizedUrl).toBe('https://apple.com/');
  });

  it('should preserve existing https:// protocol', () => {
    const res = normalizeAndValidateUrl('https://example.com/blog');
    expect(res.isValid).toBe(true);
    expect(res.normalizedUrl).toBe('https://example.com/blog');
  });

  it('should reject invalid or empty URLs', () => {
    const res1 = normalizeAndValidateUrl('');
    expect(res1.isValid).toBe(false);

    const res2 = normalizeAndValidateUrl('not-a-valid-url-format');
    expect(res2.isValid).toBe(false);
  });
});

describe('PagePulse HTML Parser Unit Tests', () => {
  it('should correctly parse title, meta description, H1 count, missing alt images, and word count', () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page Title for SEO</title>
          <meta name="description" content="This is a test meta description for testing purposes.">
        </head>
        <body>
          <h1>Main Page Heading</h1>
          <p>Welcome to the test page. This is a paragraph with several words to test word count.</p>
          <img src="test1.jpg" alt="A descriptive alt text" />
          <img src="test2.jpg" />
          <img src="test3.jpg" alt="" />
        </body>
      </html>
    `;

    const metrics = parseHtmlContent(mockHtml);

    expect(metrics.title).toBe('Test Page Title for SEO');
    expect(metrics.metaDescription).toBe('This is a test meta description for testing purposes.');
    expect(metrics.h1Count).toBe(1);
    expect(metrics.h1List).toEqual(['Main Page Heading']);
    expect(metrics.totalImages).toBe(3);
    expect(metrics.missingAltImages).toBe(2);
    expect(metrics.wordCount).toBeGreaterThan(10);
  });
});

describe('POST /api/analyze API Endpoint Integration Tests', () => {
  it('should return 400 Bad Request for invalid URL formats', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'invalid-url-domain' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid URL');
    expect(response.body).toHaveProperty('code', 'INVALID_URL');
  });

  it('should return 200 OK and audit metrics for a valid URL (example.com)', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('url');
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('responseTime');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('h1Count');
    expect(response.body).toHaveProperty('missingAltImages');
    expect(response.body).toHaveProperty('wordCount');
  });
});
