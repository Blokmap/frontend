<script lang="ts" setup>
import { useAuthProfile } from '@/composables/data/useAuth';

const { data: authProfile } = useAuthProfile();
</script>

<template>
    <RouterView v-slot="{ Component, route }">
        <Transition name="slide-in-left" mode="out-in" appear>
            <component
                v-if="authProfile"
                :is="Component"
                :key="route.matched[1]?.path"
                :auth-profile="authProfile">
            </component>
        </Transition>
    </RouterView>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
