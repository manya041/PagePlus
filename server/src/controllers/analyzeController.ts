import { Request, Response, NextFunction } from 'express';
import { normalizeAndValidateUrl } from '../utils/urlValidator';
import { AuditService } from '../services/auditService';

export async function analyzeController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { url } = req.body || {};

    // Validate URL
    const validation = normalizeAndValidateUrl(url);
    if (!validation.isValid || !validation.normalizedUrl) {
      res.status(400).json({
        error: 'Invalid URL',
        code: 'INVALID_URL',
        message: validation.error || 'Please enter a valid HTTP or HTTPS URL.'
      });
      return;
    }

    // Perform Audit
    const auditResult = await AuditService.analyzeUrl(validation.normalizedUrl);

    res.status(200).json(auditResult);
  } catch (error) {
    next(error);
  }
}
