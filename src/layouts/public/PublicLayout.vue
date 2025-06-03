<script setup lang="ts">
import PublicFooter from './PublicFooter.vue';
import PublicHeader from './PublicHeader.vue';
import { useAuthLogout, useAuthProfile } from '@/composables/services/useAuth';
import { useMessages } from '@/composables/useMessages';
import G from 'gsap';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const { showMessage } = useMessages();

const { profile, profileIsLoading } = useAuthProfile();

const { logout, logoutIsLoading } = useAuthLogout({
    onSuccess: () => {
        showMessage({
            severity: 'success',
            summary: 'Logged out',
            detail: 'You have successfully logged out.',
        });
    },
});

const route = useRoute();
const previousRoute = ref(route);

const shouldAnimate = computed(() => {
    return route.meta.animate !== false || previousRoute.value.meta.animate !== false;
});

watch(route, (_, oldRoute) => {
    previousRoute.value = oldRoute;
});

/**
 * Handles the before-enter transition for the page.
 *
 * @param el - The element being transitioned.
 */
function handleBeforeEnter(el: Element): void {
    G.set(el, {
        opacity: 0,
        scale: 0.96,
    });
}

/**
 * Handles the enter transition for the page.
 *
 * @param el - The element being transitioned.
 * @param done - Callback to call when the transition is complete.
 */
function handleEnter(el: Element, done: () => void): void {
    G.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        onComplete: done,
    });
}

/**
 * Handles the leave transition for the page.
 *
 * @param el - The element being transitioned.
 * @param done - Callback to call when the transition is complete.
 */
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
    {{ profile }}
    <PublicHeader
        :profile="profile"
        :profile-is-loading="profileIsLoading"
        :logout-is-loading="logoutIsLoading"
        @logout="logout">
    </PublicHeader>
    <main class="w-full xl:w-10/12 mx-auto my-8 px-4">
        <RouterView v-slot="{ Component, route }" v-if="shouldAnimate">
            <Transition
                mode="out-in"
                @before-enter="handleBeforeEnter"
                @enter="handleEnter"
                @leave="handleLeave"
                appear>
                <div :key="route.name">
                    <component :is="Component" />
                </div>
            </Transition>
        </RouterView>
        <RouterView v-else />
    </main>
    <PublicFooter />
</template>
