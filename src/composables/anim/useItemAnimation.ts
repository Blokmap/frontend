import { gsap } from 'gsap';
import { type Ref, ref, watch } from 'vue';

/**
 * Composable to animate a list of items using GSAP.
 *
 * @param elements - A reference to the HTML elements to animate.
 * @param options - Optional configuration for the animation.
 * @returns - An object containing the animation instance and previous item count.
 */
export async function useItemAnimation<T extends Element>(
    elements: Ref<T[]>,
    options: {
        duration?: number;
        y?: number;
        ease?: string;
        staggerAmount?: number;
    } = {},
) {
    const anim = ref<GSAPTween | null>(null);

    watch(
        () => elements.value.length,
        async () => {
            if (!elements.value || elements.value.length === 0) {
                return;
            }

            if (anim.value) {
                anim.value.kill();
            }

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
        },
        { immediate: true },
    );
}
