<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
    <div class="flex w-full items-center justify-center">
        <FontAwesomeIcon :icon="['fas', 'star']" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo {
    @apply bg-slate-900 text-white;
    @apply h-35 w-35 font-[Armageda] text-9xl;
    @apply flex items-center justify-center rounded-xl;
    @apply pt-[0.2em] leading-none;
}
</style>
