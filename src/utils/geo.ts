import type { LngLat } from "@/types/contract/Map";

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

/**
 * Checks if two LngLat values are equal.
 *
 * @param one - The first LngLat value.
 * @param two - The second LngLat value.
 * 
 * @returns `true` if both LngLat values are equal, `false` otherwise.
 */
export function latLngEqual(one?: LngLat | null, two?: LngLat | null): boolean {
    if (!one || !two) return false;
    return one[0] === two[0] && one[1] === two[1];
}