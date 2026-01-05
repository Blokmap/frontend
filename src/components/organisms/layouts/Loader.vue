<script lang="ts" setup>
import ProgressSpinner from 'primevue/progressspinner';
</script>

<template>
    <div class="loader">
        <ProgressSpinner />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.loader {
    @apply flex h-full flex-1 items-center justify-center;
}
</style>
