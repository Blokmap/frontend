<script setup lang="ts"></script>

<template>
    <div class="footer-bottom">
        <div class="text-xs">
            © {{ new Date().getFullYear() }} Blokmap. Alle rechten voorbehouden.
        </div>
        <div class="flex space-x-4 text-xs">
            <a href="#"> Privacybeleid </a>
            <a href="#"> Algemene Voorwaarden </a>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.footer-bottom {
    @apply mx-auto flex flex-col items-center justify-between rounded-b-lg;
    @apply md:flex-row md:text-left;
}
</style>
