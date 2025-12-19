import { describe, it, expect } from 'vitest';
import { deriveCoverImageFromProperty } from '@/utils/propertyPreviewCache';
import { generateTestProperty } from '@/utils/testHelpers';

describe('deriveCoverImageFromProperty', () => {
	  it('returns media cover image when present and valid', () => {
	    const property = generateTestProperty({
	      media: [
	        { id: '1', url: 'https://cdn.example.com/cover.jpg', type: 'image', isCover: true },
	        { id: '2', url: 'https://cdn.example.com/other.jpg', type: 'image', isCover: false },
	      ],
	      images: ['https://cdn.example.com/fallback.jpg'],
	      // image_url should be ignored because media cover takes precedence
	      // @ts-expect-error legacy field
	      image_url: 'https://cdn.example.com/direct.jpg',
	    } as any);

	    const result = deriveCoverImageFromProperty(property);
	    expect(result).toBe('https://cdn.example.com/cover.jpg');
	  });

	  it('falls back to image_url when no valid media cover exists', () => {
	    const property = generateTestProperty({
	      media: [
	        { id: '1', url: 'blob:https://invalid', type: 'image', isCover: true },
	      ],
	      // @ts-expect-error legacy field
	      image_url: 'https://cdn.example.com/direct.jpg',
	      images: ['https://cdn.example.com/from-images.jpg'],
	    } as any);

	    const result = deriveCoverImageFromProperty(property);
	    expect(result).toBe('https://cdn.example.com/direct.jpg');
	  });

	  it('ignores unsafe image_url values and falls back to images[]', () => {
	    const property = generateTestProperty({
	      media: [],
	      // @ts-expect-error legacy field
	      image_url: 'http://localhost:3000/dev.jpg',
	      images: ['blob:https://bad', 'https://cdn.example.com/valid-from-images.jpg'],
	    } as any);

	    const result = deriveCoverImageFromProperty(property);
	    expect(result).toBe('https://cdn.example.com/valid-from-images.jpg');
	  });

	  it('returns empty string when all sources are invalid', () => {
	    const property = generateTestProperty({
	      media: [
	        { id: '1', url: 'blob:https://invalid', type: 'image', isCover: true },
	      ],
	      // @ts-expect-error legacy field
	      image_url: 'blob:https://also-invalid',
	      images: ['blob:https://bad', 'localhost-image', ''],
	    } as any);

	    const result = deriveCoverImageFromProperty(property);
	    expect(result).toBe('');
	  });

	  it('handles legacy string images field', () => {
	    const property: any = {
	      ...generateTestProperty(),
	      media: [],
	      images: 'https://cdn.example.com/string-image.jpg',
	    };

	    const result = deriveCoverImageFromProperty(property);
	    expect(result).toBe('https://cdn.example.com/string-image.jpg');
	  });

	  it('returns empty string when property is null or undefined', () => {
	    // @ts-expect-error intentional null
	    expect(deriveCoverImageFromProperty(null)).toBe('');
	    // @ts-expect-error intentional undefined
	    expect(deriveCoverImageFromProperty(undefined)).toBe('');
	  });
});
