import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import axios from 'axios';
import app from '../server';
import { parseHtmlContent } from '../parsers/htmlParser';
import { normalizeAndValidateUrl } from '../utils/urlValidator';

vi.mock('axios');

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

  it('should return 200 OK and audit metrics for a successful website audit', async () => {
    const mockHtml = '<html><head><title>Example Domain</title></head><body><h1>Example Domain</h1><p>This domain is for use in illustrative examples in documents.</p></body></html>';
    
    (axios.get as any).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/html; charset=UTF-8' },
      data: mockHtml
    });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('url', 'https://example.com/');
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('title', 'Example Domain');
    expect(response.body).toHaveProperty('h1Count', 1);
    expect(response.body).toHaveProperty('wordCount');
  });

  it('should return 400 Bad Request for Non-HTML resources (PDF/Image)', async () => {
    (axios.get as any).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/pdf' },
      data: '%PDF-1.4 dummy pdf bytes'
    });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com/document.pdf' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 'NON_HTML');
    expect(response.body).toHaveProperty('error', 'Non HTML content detected');
  });

  it('should return 504 Timeout error when server times out', async () => {
    const timeoutError = new Error('timeout of 10000ms exceeded');
    (timeoutError as any).code = 'ECONNABORTED';

    (axios.get as any).mockRejectedValueOnce(timeoutError);

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://slow-website.com' });

    expect(response.status).toBe(504);
    expect(response.body).toHaveProperty('code', 'TIMEOUT');
  });
});
