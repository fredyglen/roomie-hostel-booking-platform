/**
 * Input sanitization utilities for security
 * Prevents XSS attacks and ensures data integrity
 */

import { logger } from './enhanced-logger';

// HTML entities for escaping
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

// Dangerous HTML tags that should be stripped
const DANGEROUS_TAGS = [
  'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 
  'select', 'button', 'link', 'meta', 'style', 'base', 'applet'
];

// Safe HTML tags for rich text (if needed)
const SAFE_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'
];

export interface SanitizationOptions {
  allowHtml?: boolean;
  allowedTags?: string[];
  maxLength?: number;
  trimWhitespace?: boolean;
  removeEmptyLines?: boolean;
}

export class InputSanitizer {
  /**
   * Escape HTML entities to prevent XSS
   */
  static escapeHtml(input: string): string {
    if (typeof input !== 'string') {
      return String(input);
    }
    
    return input.replace(/[&<>"'/]/g, (match) => HTML_ENTITIES[match] || match);
  }

  /**
   * Remove all HTML tags from input
   */
  static stripHtml(input: string): string {
    if (typeof input !== 'string') {
      return String(input);
    }
    
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * Sanitize HTML by removing dangerous tags and attributes
   */
  static sanitizeHtml(input: string, allowedTags: string[] = SAFE_TAGS): string {
    if (typeof input !== 'string') {
      return String(input);
    }

    let sanitized = input;

    // Remove dangerous tags completely
    DANGEROUS_TAGS.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi');
      sanitized = sanitized.replace(regex, '');
      
      // Also remove self-closing versions
      const selfClosingRegex = new RegExp(`<${tag}[^>]*/>`, 'gi');
      sanitized = sanitized.replace(selfClosingRegex, '');
    });

    // Remove all attributes from allowed tags (keep only the tag itself)
    allowedTags.forEach(tag => {
      const regex = new RegExp(`<(${tag})([^>]*)>`, 'gi');
      sanitized = sanitized.replace(regex, `<$1>`);
    });

    // Remove any remaining tags not in allowed list
    const allowedTagsRegex = new RegExp(`<(?!/?(?:${allowedTags.join('|')})\\b)[^>]*>`, 'gi');
    sanitized = sanitized.replace(allowedTagsRegex, '');

    return sanitized;
  }

  /**
   * Sanitize user input with various options
   */
  static sanitizeInput(
    input: unknown, 
    options: SanitizationOptions = {}
  ): string {
    const {
      allowHtml = false,
      allowedTags = SAFE_TAGS,
      maxLength,
      trimWhitespace = true,
      removeEmptyLines = false
    } = options;

    // Convert to string
    let sanitized = String(input || '');

    // Trim whitespace if requested
    if (trimWhitespace) {
      sanitized = sanitized.trim();
    }

    // Remove empty lines if requested
    if (removeEmptyLines) {
      sanitized = sanitized.replace(/^\s*[\r\n]/gm, '');
    }

    // Handle HTML
    if (allowHtml) {
      sanitized = this.sanitizeHtml(sanitized, allowedTags);
    } else {
      sanitized = this.stripHtml(sanitized);
      sanitized = this.escapeHtml(sanitized);
    }

    // Enforce max length
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
      logger.warn('Input truncated due to length limit', { 
        originalLength: input?.toString().length,
        maxLength,
        truncated: true
      });
    }

    return sanitized;
  }

  /**
   * Sanitize email addresses
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeInput(email, { 
      allowHtml: false, 
      trimWhitespace: true 
    }).toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }

    return sanitized;
  }

  /**
   * Sanitize phone numbers
   */
  static sanitizePhone(phone: string): string {
    // Remove all non-digit characters except + at the beginning
    let sanitized = phone.replace(/[^\d+]/g, '');
    
    // Ensure + is only at the beginning
    if (sanitized.includes('+')) {
      const parts = sanitized.split('+');
      sanitized = '+' + parts.join('');
    }

    return sanitized;
  }

  /**
   * Sanitize URLs
   */
  static sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeInput(url, { 
      allowHtml: false, 
      trimWhitespace: true 
    });

    // Only allow http and https protocols
    try {
      const urlObj = new URL(sanitized);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Invalid URL protocol');
      }
      return urlObj.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  /**
   * Sanitize file names
   */
  static sanitizeFileName(fileName: string): string {
    // Remove path traversal attempts and dangerous characters
    let sanitized = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
    
    // Remove leading/trailing dots and spaces
    sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');
    
    // Prevent reserved names on Windows
    const reservedNames = [
      'CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 
      'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 
      'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];
    
    const nameWithoutExt = sanitized.split('.')[0].toUpperCase();
    if (reservedNames.includes(nameWithoutExt)) {
      sanitized = `file_${sanitized}`;
    }

    // Ensure reasonable length
    if (sanitized.length > 255) {
      const ext = sanitized.split('.').pop();
      const name = sanitized.substring(0, 255 - (ext?.length || 0) - 1);
      sanitized = ext ? `${name}.${ext}` : name;
    }

    return sanitized || 'unnamed_file';
  }

  /**
   * Sanitize search queries
   */
  static sanitizeSearchQuery(query: string): string {
    let sanitized = this.sanitizeInput(query, { 
      allowHtml: false, 
      trimWhitespace: true,
      maxLength: 200
    });

    // Remove SQL injection attempts
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(--|\/\*|\*\/|;)/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi
    ];

    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
  }

  /**
   * Validate and sanitize JSON input
   */
  static sanitizeJson(input: string): unknown {
    try {
      const parsed = JSON.parse(input);
      
      // Recursively sanitize string values in the object
      const sanitizeObject = (obj: unknown): unknown => {
        if (typeof obj === 'string') {
          return this.sanitizeInput(obj);
        }

        if (Array.isArray(obj)) {
          return obj.map(sanitizeObject);
        }

        if (obj && typeof obj === 'object') {
          const sanitizedObj: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(obj)) {
            const sanitizedKey = this.sanitizeInput(key);
            sanitizedObj[sanitizedKey] = sanitizeObject(value);
          }
          return sanitizedObj;
        }

        return obj;
      };

      return sanitizeObject(parsed);
    } catch {
      throw new Error('Invalid JSON format');
    }
  }
}

/**
 * Convenience functions for common sanitization tasks
 */
export const sanitize = {
  html: InputSanitizer.escapeHtml,
  input: InputSanitizer.sanitizeInput,
  email: InputSanitizer.sanitizeEmail,
  phone: InputSanitizer.sanitizePhone,
  url: InputSanitizer.sanitizeUrl,
  fileName: InputSanitizer.sanitizeFileName,
  searchQuery: InputSanitizer.sanitizeSearchQuery,
  json: InputSanitizer.sanitizeJson,
};

export default InputSanitizer;
