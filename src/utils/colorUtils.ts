/**
 * Calculate the relative luminance of a color.
 * Based on WCAG standards for contrast calculation.
 *
 * @param hex - The hex color code (e.g., '#ff0000')
 * @returns The relative luminance value (0-1)
 */
export function getLuminance(hex: string): number {
    // Remove # if present
    const color = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(color.substring(0, 2), 16) / 255;
    const g = parseInt(color.substring(2, 4), 16) / 255;
    const b = parseInt(color.substring(4, 6), 16) / 255;

    // Apply gamma correction
    const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );

    // Calculate luminance
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Convert hex color to RGB values.
 *
 * @param hex - The hex color code (e.g., '#ff0000')
 * @returns RGB values as an object
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const color = hex.replace('#', '');
    return {
        r: parseInt(color.substring(0, 2), 16),
        g: parseInt(color.substring(2, 4), 16),
        b: parseInt(color.substring(4, 6), 16),
    };
}

/**
 * Convert RGB values to hex color.
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color code
 */
function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lighten a color by mixing it with white.
 *
 * @param hex - The hex color code
 * @param amount - Amount to lighten (0-1, where 1 is pure white)
 * @returns Lightened hex color
 */
function lighten(hex: string, amount: number): string {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

/**
 * Darken a color by mixing it with black.
 *
 * @param hex - The hex color code
 * @param amount - Amount to darken (0-1, where 1 is pure black)
 * @returns Darkened hex color
 */
function darken(hex: string, amount: number): string {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/**
 * Get high contrast text color based on background color.
 * Uses lighter tint for dark backgrounds and darker tint for light backgrounds.
 *
 * @param bgColor - The background color in hex format
 * @returns A tinted color that provides good contrast
 */
export function getContrastColor(bgColor: string): string {
    const luminance = getLuminance(bgColor);

    // For dark backgrounds (low luminance), return a very light tint
    if (luminance < 0.5) {
        return lighten(bgColor, 0.6); // 60% lighter
    }

    // For light backgrounds (high luminance), return a very dark tint
    return darken(bgColor, 0.6); // 60% darker
}
