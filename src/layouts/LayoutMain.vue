<template>
    <main class="main">
        <slot></slot>
    </main>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.main {
    @apply space-y-12 lg:pl-12;
}
</style>
