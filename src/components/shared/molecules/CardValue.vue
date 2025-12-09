<template>
    <div class="card-value">
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card-value {
    @apply px-3 py-2 text-sm break-words;
}
</style>
