<template>
    <footer>
        <div class="footer"></div>
        <div class="copyright">
            © {{ new Date().getFullYear() }} Blokmap. Alle rechten voorbehouden.
        </div>
    </footer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.footer {
    @apply mx-auto grid grid-cols-1 gap-8 px-6 py-12 text-sm md:grid-cols-4;
    @apply dark:border-surface-800 relative z-10 flex rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3;
}

.copyright {
    @apply mt-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400;
}
</style>
