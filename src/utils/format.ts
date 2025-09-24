/**
 * Abbreviates large numbers with appropriate suffixes (K, M, B).
 *
 * @param count - The number to abbreviate
 * @returns Abbreviated string representation
 */
export function abbreviateCount(count?: number): string | undefined | null {
    if (count === undefined || count === null) {
        return count;
    }

    if (count < 1000) {
        return count.toString();
    }

    if (count < 1000000) {
        const k = count / 1000;
        return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
    }

    if (count < 1000000000) {
        const m = count / 1000000;
        return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
    }

    const b = count / 1000000000;
    return b % 1 === 0 ? `${b}B` : `${b.toFixed(1)}B`;
}
