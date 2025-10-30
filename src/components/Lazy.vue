<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';

const targetRef = useTemplateRef<HTMLElement>('target');

const shouldRender = ref<boolean>(false);

const { stop } = useIntersectionObserver(
    targetRef,
    ([{ isIntersecting }]) => {
        if (isIntersecting) {
            shouldRender.value = true;
            stop();
        }
    },
    {
        rootMargin: '600px',
    },
);
</script>

<template>
    <div ref="target">
        <slot v-if="shouldRender"></slot>
    </div>
</template>
