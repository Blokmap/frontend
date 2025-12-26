<script setup lang="ts"></script>

<template>
    <div class="footer-bottom">
        <div class="text-xs">
            &copy; {{ new Date().getFullYear() }} Blokmap. Alle rechten voorbehouden.
        </div>
        <div class="flex space-x-4 text-xs">
            <RouterLink :to="{ name: 'legal.privacy' }"> Privacybeleid </RouterLink>
            <RouterLink :to="{ name: 'legal.terms' }"> Algemene Voorwaarden </RouterLink>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.footer-bottom {
    @apply mx-auto flex flex-col items-center justify-between gap-3 rounded-b-lg;
    @apply md:flex-row md:text-left;
}
</style>
