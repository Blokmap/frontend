import gsap from 'gsap';
import { type MaybeRef, onMounted, toValue } from 'vue';

/**
 * Applies a bold entrance animation to the entire element.
 * No DOM manipulation. Safe for styled/complex HTML.
 */
export function useTitleAnimation(selectorOrElement: MaybeRef<string | Element | null>) {
    onMounted(() => {
        const raw = toValue(selectorOrElement);
        const el = typeof raw === 'string' ? document.querySelector(raw) : raw;

        if (!el) return;

        gsap.fromTo(
            el,
            {
                opacity: 0,
                scale: 0.8,
                rotationX: 60,
                transformOrigin: 'top center',
                filter: 'blur(8px)',
            },
            {
                opacity: 1,
                scale: 1,
                rotationX: 0,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'expo.out',
            },
        );
    });
}
