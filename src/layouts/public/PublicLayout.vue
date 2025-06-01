<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
import G from 'gsap';

function handleBeforeEnter(el: Element): void {
    G.set(el, {
        opacity: 0,
        scale: 0.96,
    });
}

function handleEnter(el: Element, done: () => void): void {
    G.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        onComplete: done,
    });
}

function handleLeave(el: Element, done: () => void): void {
    G.to(el, {
        opacity: 0,
        scale: 0.96,
        duration: 0.3,
        onComplete: done,
    });
}
</script>

<template>
    <PublicHeader />
    <main class="w-full xl:w-10/12 mx-auto my-8 px-4">
        <RouterView v-slot="{ Component, route }">
            <Transition
                mode="out-in"
                @before-enter="handleBeforeEnter"
                @enter="handleEnter"
                @leave="handleLeave"
                appear>
                <div :key="route.fullPath">
                    <component :is="Component" />
                </div>
            </Transition>
        </RouterView>
    </main>
    <PublicFooter />
</template>
