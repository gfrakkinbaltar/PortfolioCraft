/**
 * Security utilities for PortfolioCraft
 * Provides input sanitization and XSS protection
 */

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param {string} input - Raw HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Sanitize URL to prevent javascript: protocol injection
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL or empty string
 */
export function sanitizeURL(url) {
    try {
        const parsed = new URL(url, window.location.origin);
        // Only allow http, https, mailto protocols
        if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch (e) {
        console.warn('Invalid URL:', url);
    }
    return '';
}