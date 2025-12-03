<script lang="ts" setup>
import { useAuthProfile } from '@/composables/data/useAuth';

const { data: authProfile } = useAuthProfile();
</script>

<template>
    <div class="container">
        <RouterView name="sidebar" v-slot="{ Component, route }" class="container__sidebar">
            <Transition name="slide-in-left" mode="out-in" appear>
                <component
                    v-if="authProfile"
                    :is="Component"
                    :key="route.path"
                    :auth-profile="authProfile">
                </component>
            </Transition>
        </RouterView>
        <main class="container__main">
            <RouterView v-slot="{ Component, route }">
                <Transition name="fade-slide-up" mode="out-in" appear>
                    <component
                        v-if="authProfile"
                        :is="Component"
                        :key="route.path"
                        :auth-profile="authProfile">
                    </component>
                </Transition>
            </RouterView>
        </main>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.container {
    @apply mx-auto grid w-full flex-1 grid-cols-1 lg:my-4 lg:max-w-[1420px] lg:grid-cols-4 lg:px-0;
}

.container__sidebar {
    @apply col-span-1 lg:pr-12;
}

.container__main {
    @apply col-span-3 space-y-12 lg:pl-12;
}
</style>
