/**
 * Image optimization utilities for ROOMi platform
 * Handles image compression, resizing, and format conversion
 */

import { logger } from './enhanced-logger';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1 for JPEG, 0-100 for WebP
  format?: 'jpeg' | 'webp' | 'png';
  maintainAspectRatio?: boolean;
}

export interface OptimizedImage {
  file: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export class ImageOptimizer {
  private static readonly DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'webp',
    maintainAspectRatio: true,
  };

  /**
   * Optimize a single image file
   */
  static async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File is not an image');
      }

      // Create image element
      const img = await this.loadImage(file);
      
      // Calculate new dimensions
      const { width, height } = this.calculateDimensions(
        img.naturalWidth,
        img.naturalHeight,
        opts.maxWidth,
        opts.maxHeight,
        opts.maintainAspectRatio
      );

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = width;
      canvas.height = height;

      // Use high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to optimized format
      const optimizedFile = await this.canvasToFile(
        canvas,
        opts.format,
        opts.quality,
        file.name
      );

      const compressionRatio = (file.size - optimizedFile.size) / file.size;

      logger.info('Image optimized', {
        originalSize: file.size,
        optimizedSize: optimizedFile.size,
        compressionRatio: compressionRatio * 100,
        originalDimensions: { width: img.naturalWidth, height: img.naturalHeight },
        newDimensions: { width, height },
        format: opts.format
      });

      return {
        file: optimizedFile,
        originalSize: file.size,
        optimizedSize: optimizedFile.size,
        compressionRatio,
        dimensions: { width, height }
      };

    } catch (error) {
      logger.error('Image optimization failed', { error, fileName: file.name });
      throw error;
    }
  }

  /**
   * Optimize multiple images
   */
  static async optimizeImages(
    files: File[],
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage[]> {
    const results: OptimizedImage[] = [];
    
    for (const file of files) {
      try {
        const optimized = await this.optimizeImage(file, options);
        results.push(optimized);
      } catch (error) {
        logger.error('Failed to optimize image', { fileName: file.name, error });
        // Continue with other images even if one fails
      }
    }

    return results;
  }

  /**
   * Load image from file
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
    maintainAspectRatio: boolean
  ): { width: number; height: number } {
    if (!maintainAspectRatio) {
      return {
        width: Math.min(originalWidth, maxWidth),
        height: Math.min(originalHeight, maxHeight)
      };
    }

    const aspectRatio = originalWidth / originalHeight;
    
    let width = Math.min(originalWidth, maxWidth);
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Convert canvas to file
   */
  private static canvasToFile(
    canvas: HTMLCanvasElement,
    format: 'jpeg' | 'webp' | 'png',
    quality: number,
    originalFileName: string
  ): Promise<File> {
    return new Promise((resolve) => {
      const mimeType = `image/${format}`;
      const fileName = this.changeFileExtension(originalFileName, format);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], fileName, { type: mimeType });
            resolve(file);
          } else {
            throw new Error('Failed to create blob from canvas');
          }
        },
        mimeType,
        format === 'jpeg' ? quality : quality / 100
      );
    });
  }

  /**
   * Change file extension
   */
  private static changeFileExtension(fileName: string, newExtension: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
    return `${nameWithoutExt}.${newExtension}`;
  }

  /**
   * Generate responsive image sizes
   */
  static async generateResponsiveSizes(
    file: File,
    sizes: number[] = [320, 640, 1024, 1920]
  ): Promise<{ size: number; file: File }[]> {
    const results: { size: number; file: File }[] = [];
    
    for (const size of sizes) {
      try {
        const optimized = await this.optimizeImage(file, {
          maxWidth: size,
          maxHeight: size,
          format: 'webp',
          quality: 0.8
        });
        
        results.push({
          size,
          file: optimized.file
        });
      } catch (error) {
        logger.error('Failed to generate responsive size', { size, error });
      }
    }

    return results;
  }

  /**
   * Create thumbnail
   */
  static async createThumbnail(
    file: File,
    size: number = 150
  ): Promise<File> {
    const optimized = await this.optimizeImage(file, {
      maxWidth: size,
      maxHeight: size,
      format: 'webp',
      quality: 0.7,
      maintainAspectRatio: true
    });

    return optimized.file;
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File is not an image' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'Image file is too large (max 10MB)' };
    }

    // Check supported formats
    const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedFormats.includes(file.type)) {
      return { valid: false, error: 'Unsupported image format' };
    }

    return { valid: true };
  }
}

/**
 * React hook for image optimization
 */
export function useImageOptimizer() {
  const optimizeImage = async (
    file: File,
    options?: ImageOptimizationOptions
  ): Promise<OptimizedImage> => {
    return ImageOptimizer.optimizeImage(file, options);
  };

  const optimizeImages = async (
    files: File[],
    options?: ImageOptimizationOptions
  ): Promise<OptimizedImage[]> => {
    return ImageOptimizer.optimizeImages(files, options);
  };

  const createThumbnail = async (file: File, size?: number): Promise<File> => {
    return ImageOptimizer.createThumbnail(file, size);
  };

  const validateImage = (file: File) => {
    return ImageOptimizer.validateImageFile(file);
  };

  return {
    optimizeImage,
    optimizeImages,
    createThumbnail,
    validateImage,
  };
}

export default ImageOptimizer;
