import { describe, expect, it, beforeEach, vi } from 'vitest';
import { pullRedirectUrl, pushRedirectUrl } from '@/domain/auth';

describe('auth helpers', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('pushRedirectUrl', () => {
        it('should store redirect URL in localStorage', () => {
            const url = '/dashboard/profile';
            pushRedirectUrl(url);
            expect(localStorage.getItem('redirectAfterLogin')).toBe(url);
        });

        it('should overwrite previous URL', () => {
            pushRedirectUrl('/first-url');
            pushRedirectUrl('/second-url');
            expect(localStorage.getItem('redirectAfterLogin')).toBe('/second-url');
        });
    });

    describe('pullRedirectUrl', () => {
        it('should retrieve stored URL', () => {
            const url = '/dashboard/profile';
            localStorage.setItem('redirectAfterLogin', url);
            expect(pullRedirectUrl()).toBe(url);
        });

        it('should remove URL from localStorage after retrieval', () => {
            const url = '/dashboard/profile';
            localStorage.setItem('redirectAfterLogin', url);
            pullRedirectUrl();
            expect(localStorage.getItem('redirectAfterLogin')).toBeNull();
        });

        it('should return null when no URL is stored', () => {
            expect(pullRedirectUrl()).toBeNull();
        });

        it('should be idempotent - second call returns null', () => {
            pushRedirectUrl('/some-url');
            pullRedirectUrl();
            expect(pullRedirectUrl()).toBeNull();
        });
    });
});
