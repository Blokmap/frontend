import { describe, expect, it } from 'vitest';
import { getImageBodyPreviewUrl, imageToBody } from '@/domain/image';
import { createMockImage, createMockImageBody } from '../../mocks';

describe('image helpers', () => {
    describe('imageToBody', () => {
        it('should convert image to request with primary flag for first image', () => {
            const image = createMockImage({
                id: 1,
                index: 0,
                url: 'https://example.com/image.jpg',
            });

            const result = imageToBody(image, 0);

            expect(result).toEqual({
                id: 1,
                imageUrl: 'https://example.com/image.jpg',
                tempUrl: 'https://example.com/image.jpg',
                index: 0,
            });
        });

        it('should convert image to request without primary flag for non-first image', () => {
            const image = createMockImage({
                id: 2,
                url: 'https://example.com/image2.jpg',
                index: 1,
            });

            const result = imageToBody(image, 1);

            expect(result).toEqual({
                id: 2,
                imageUrl: 'https://example.com/image2.jpg',
                tempUrl: 'https://example.com/image2.jpg',
                index: 1,
            });
        });

        it('should handle different indices correctly', () => {
            const image = createMockImage({
                id: 5,
                index: 4,
                url: 'https://example.com/image5.jpg',
            });

            const result = imageToBody(image, 4);

            expect(result.index).toBe(4);
        });
    });

    describe('getImageBodyPreviewUrl', () => {
        it('should return tempUrl if available', () => {
            const image = createMockImageBody({
                tempUrl: 'https://temp.com/image.jpg',
                imageUrl: 'https://original.com/image.jpg',
                index: 0,
            });

            expect(getImageBodyPreviewUrl(image)).toBe('https://temp.com/image.jpg');
        });

        it('should return imageUrl if tempUrl not available', () => {
            const image = createMockImageBody({
                tempUrl: null,
                imageUrl: 'https://original.com/image.jpg',
                index: 0,
            });

            expect(getImageBodyPreviewUrl(image)).toBe('https://original.com/image.jpg');
        });

        it('should return empty string if no URLs available', () => {
            const image = createMockImageBody({
                tempUrl: null,
                imageUrl: null,
                index: 0,
            });

            expect(getImageBodyPreviewUrl(image)).toBe('');
        });

        it('should prefer tempUrl over imageUrl', () => {
            const image = createMockImageBody({
                tempUrl: 'https://temp.com/image.jpg',
                imageUrl: 'https://original.com/image.jpg',
                index: 0,
            });

            expect(getImageBodyPreviewUrl(image)).toBe('https://temp.com/image.jpg');
        });
    });
});
