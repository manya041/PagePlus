export function normalizeAndValidateUrl(inputUrl: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'URL parameter is required and must be a non-empty string.' };
  }

  let trimmed = inputUrl.trim();

  // Prepend https:// if no protocol is given
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    
    // Check hostname and protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are supported.' };
    }

    if (!parsed.hostname || parsed.hostname.length < 3 || !parsed.hostname.includes('.')) {
      return { isValid: false, error: 'Please enter a valid URL.' };
    }

    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL.' };
  }
}
