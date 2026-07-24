export interface AuditResult {
  url: string;
  status: number;
  statusText: string;
  contentType: string;
  responseTime: number; // in milliseconds
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
  timestamp: string;
}

export interface AnalyzeRequest {
  url: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  error: string;
  code: 'INVALID_URL' | 'TIMEOUT' | 'NON_HTML' | 'NETWORK_ERROR' | 'NOT_FOUND' | 'SERVER_ERROR';
  message: string;
  status?: number;
}
