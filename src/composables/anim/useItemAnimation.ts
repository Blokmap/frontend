import { gsap } from 'gsap';
import { type Ref, ref, watch } from 'vue';

type ItemAnimationOptions = {
    duration?: number;
    y?: number;
    ease?: string;
    staggerAmount?: number;
};

/**
 * Composable to animate a list of items using GSAP.
 *
 * @param elements - A reference to the HTML elements to animate.
 * @param options - Optional configuration for the animation.
 * @returns - An object containing the cleanup function.
 */
export function useItemAnimation<T extends Element>(
    elements: Ref<T[]>,
    options: ItemAnimationOptions = {},
) {
    const anim = ref<GSAPTween | null>(null);

    function cleanupAnimation() {
        if (!anim.value) return;
        anim.value.revert();
        anim.value.kill();
        anim.value = null;
    }

    function animateElements() {
        if (!elements.value || elements.value.length === 0) {
            return;
        }

        cleanupAnimation();

        anim.value = gsap.fromTo(
            elements.value,
            { opacity: 0, y: options.y ?? 20 },
            {
                opacity: 1,
                y: 0,
                duration: options.duration ?? 0.3,
                ease: options.ease ?? 'power2.out',
                stagger: {
                    amount: options.staggerAmount ?? 0.5,
                    from: 'start',
                },
            },
        );
    }

    watch(() => elements.value.length, animateElements);

    return {
        cleanupAnimation,
    };
}
