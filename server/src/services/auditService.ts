import axios, { AxiosError } from 'axios';
import { performance } from 'perf_hooks';
import { parseHtmlContent } from '../parsers/htmlParser';
import { AuditResult, ApiErrorResponse } from '../types';

export class AuditService {
  public static async analyzeUrl(targetUrl: string): Promise<AuditResult> {
    const startTime = performance.now();
    // Reject obvious non-HTML resources before making a request
const parsedUrl = new URL(targetUrl);
const pathname = parsedUrl.pathname.toLowerCase();

const blockedExtensions = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.ico',
  '.pdf',
  '.json',
  '.xml',
  '.zip',
  '.rar',
  '.7z',
  '.mp3',
  '.mp4',
  '.avi',
  '.mov'
];

if (
  blockedExtensions.some(ext => pathname.endsWith(ext)) ||
  pathname.startsWith('/api') ||
  parsedUrl.hostname.startsWith('api.')
) {
  throw {
    success: false,
    error: 'Unsupported Content Type',
    code: 'NON_HTML',
    message: 'The provided URL is not an HTML webpage.',
    status: 400
  };
}

    try {
      const response = await axios.get(targetUrl, {
        timeout: 10000, // 10s timeout
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 PagePulse-Bot/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        validateStatus: (status) => status < 600 // Accept all HTTP statuses to inspect 404, 500 etc.
      });

      const responseTime = Math.round(performance.now() - startTime);
      const contentType = String(response.headers['content-type'] || '').toLowerCase();

      // Strict Non-HTML Detection
      const isHtml = contentType.includes('text/html') || contentType.includes('application/xhtml+xml');

      if (!isHtml) {
        const nonHtmlErr: ApiErrorResponse = {
          success: false,
          error: 'Unsupported Content Type',
          code: 'NON_HTML',
          message: 'The provided URL is not an HTML webpage.',
          status: 400
        };
        throw nonHtmlErr;
      }

      const htmlContent = typeof response.data === 'string' ? response.data : String(response.data || '');
      const parsedMetrics = parseHtmlContent(htmlContent);

      const statusTextMap: Record<number, string> = {
        200: 'OK',
        201: 'Created',
        301: 'Moved Permanently',
        302: 'Found',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable'
      };

      return {
        url: targetUrl,
        status: response.status,
        statusText: response.statusText || statusTextMap[response.status] || 'HTTP Status',
        contentType: String(response.headers['content-type'] || 'text/html'),
        responseTime,
        title: parsedMetrics.title,
        titleLength: parsedMetrics.titleLength,
        metaDescription: parsedMetrics.metaDescription,
        metaDescriptionLength: parsedMetrics.metaDescriptionLength,
        h1Count: parsedMetrics.h1Count,
        h1List: parsedMetrics.h1List,
        missingAltImages: parsedMetrics.missingAltImages,
        totalImages: parsedMetrics.totalImages,
        missingAltDetails: parsedMetrics.missingAltDetails,
        wordCount: parsedMetrics.wordCount,
        readingTimeMinutes: parsedMetrics.readingTimeMinutes,
        contentDepth: parsedMetrics.contentDepth,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      // If error is already our ApiErrorResponse thrown above
      if (error.code && error.error && error.message) {
        throw error;
      }

      const axiosErr = error as AxiosError;
      const errorContentType = String(
  axiosErr.response?.headers?.['content-type'] || ''
).toLowerCase();

if (
  errorContentType &&
  !errorContentType.includes('text/html') &&
  !errorContentType.includes('application/xhtml+xml')
) {
  throw {
    success: false,
    error: 'Unsupported Content Type',
    code: 'NON_HTML',
    message: 'The provided URL is not an HTML webpage.',
    status: 400
  };
}
      if (axiosErr.code === 'ECONNABORTED' || axiosErr.message?.includes('timeout')) {
        const timeoutErr: ApiErrorResponse = {
          error: 'Connection Timeout',
          code: 'TIMEOUT',
          message: 'Connection timed out after 10 seconds. The website took too long to respond.',
          status: 504
        };
        throw timeoutErr;
      }

      if (axiosErr.code === 'ENOTFOUND' || axiosErr.code === 'ECONNREFUSED') {
        const notFoundErr: ApiErrorResponse = {
          error: 'Network Error',
          code: 'NOT_FOUND',
          message: 'Unable to connect to website. Please verify the domain is active and online.',
          status: 502
        };
        throw notFoundErr;
      }

      if (axiosErr.response?.status === 405) {
      throw {
        success: false,
        error: 'Unsupported Content Type',
        code: 'NON_HTML',
        message: 'The provided URL is not an HTML webpage.',
        status: 400
      };
    }
      if (axiosErr.response?.status === 404) {
        const err404: ApiErrorResponse = {
          error: 'Not Found',
          code: 'NOT_FOUND',
          message: 'Website not found. The server responded with a 404 HTTP status code.',
          status: 404
        };
        throw err404;
      }

      if (axiosErr.response && axiosErr.response.status >= 500) {
        const err500: ApiErrorResponse = {
          error: 'Internal Server Error',
          code: 'SERVER_ERROR',
          message: 'Internal server error. Target server failed to fulfill the request.',
          status: 500
        };
        throw err500;
      }

      const genericErr: ApiErrorResponse = {
        error: 'Analysis Failed',
        code: 'NETWORK_ERROR',
        message: axiosErr.message || 'Unable to connect to website.',
        status: 500
      };
      throw genericErr;
    }
  }
}
