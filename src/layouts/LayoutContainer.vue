<template>
    <div class="container">
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.container {
    @apply mx-auto my-4 grid h-full max-w-[1240px] grid-cols-1 lg:grid-cols-3;
}
</style>
