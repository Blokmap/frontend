/**
 * Rounds a latitude or longitude value to a specified number of decimal digits.
 *
 * @param n - The latitude or longitude value to round. If `null` or `undefined`, returns `null`.
 * @param digits - The number of decimal digits to round to. Defaults to 4.
 * @returns The rounded value as a number, or `null` if the input was `null` or `undefined`.
 */
export function roundLatLng(n: number | null | undefined, digits = 4): number | null {
    return n == null ? null : parseFloat(n.toFixed(digits));
}
