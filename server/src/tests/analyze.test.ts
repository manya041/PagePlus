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

  it('should return 200 OK and parse HTML content normally for valid HTML page', async () => {
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
    expect(response.body).toHaveProperty('contentType', 'text/html; charset=UTF-8');
    expect(response.body).toHaveProperty('title', 'Example Domain');
    expect(response.body).toHaveProperty('h1Count', 1);
  });

  it('should parse HTML 404 pages normally when content-type is text/html', async () => {
    const mockHtml = '<html><head><title>404 Not Found</title></head><body><h1>Custom 404 Page</h1></body></html>';
    
    (axios.get as any).mockResolvedValueOnce({
      status: 404,
      statusText: 'Not Found',
      headers: { 'content-type': 'text/html; charset=UTF-8' },
      data: mockHtml
    });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com/missing-page' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 404);
    expect(response.body).toHaveProperty('title', '404 Not Found');
    expect(response.body).toHaveProperty('h1Count', 1);
  });

  it('should return 400 Unsupported Content Type for PDF resources', async () => {
    (axios.get as any).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/pdf' },
      data: '%PDF-1.4 dummy pdf content'
    });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com/document.pdf' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 'NON_HTML');
    expect(response.body).toHaveProperty('error', 'Unsupported Content Type');
    expect(response.body).toHaveProperty('message', 'The provided URL is not an HTML webpage.');
  });

  it('should return 400 Unsupported Content Type for Image resources', async () => {
    (axios.get as any).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'image/png' },
      data: 'png binary data'
    });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com/logo.png' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 'NON_HTML');
    expect(response.body).toHaveProperty('error', 'Unsupported Content Type');
  });

  it('should return 400 Unsupported Content Type for JSON resources', async () => {
    (axios.get as any).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      data: '{"key": "value"}'
    });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://api.github.com/users' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 'NON_HTML');
  });

  it('should return 400 Unsupported Content Type for Plain Text resources', async () => {
    (axios.get as any).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/plain' },
      data: 'plain text content'
    });

    const response = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com/robots.txt' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 'NON_HTML');
  });

  it('should return 504 Timeout error when server connection times out', async () => {
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
