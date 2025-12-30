import { useIntersectionObserver } from '@vueuse/core';
import { nextTick, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';

export type ScrollSpySection = {
    element: Ref<HTMLElement | null>;
    hash: string;
};

export function useScrollSpy(defaultHash: string, sections: ScrollSpySection[]) {
    const route = useRoute();
    const activeHash = ref<string>(route.hash || defaultHash);

    watch(
        () => route.hash,
        (newHash) => {
            if (newHash) {
                activeHash.value = newHash;
            }
        },
    );

    const observerOptions = {
        rootMargin: '-50% 0px -50% 0px',
    };

    for (const { element, hash } of sections) {
        useIntersectionObserver(
            element,
            ([{ isIntersecting }]) => {
                if (isIntersecting) {
                    activeHash.value = hash;
                }
            },
            observerOptions,
        );
    }

    onMounted(async () => {
        const activeSection = sections.find((s) => s.hash === activeHash.value);
        const activeSectionElement = activeSection?.element.value;

        if (activeSectionElement) {
            await nextTick();
            activeSectionElement.scrollTo({
                behavior: 'smooth',
            });
        }
    });

    return {
        activeHash,
    };
}
