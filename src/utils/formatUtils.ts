/**
 * Abbreviates large numbers with appropriate suffixes (K, M, B).
 *
 * @param count - The number to abbreviate
 * @returns Abbreviated string representation
 */
export function abbreviateCount(count?: number | null): string | undefined | null {
    if (count === undefined || count === null) {
        return count;
    }

    if (count < 1_000) {
        return count.toString();
    }

    if (count < 1_000_000) {
        const k = count / 1_000;
        return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
    }

    if (count < 1_000_000_000) {
        const m = count / 1_000_000;
        return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
    }

    const b = count / 1_000_000_000;
    return b % 1 === 0 ? `${b}B` : `${b.toFixed(1)}B`;
}
