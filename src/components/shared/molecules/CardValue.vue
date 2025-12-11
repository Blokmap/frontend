<template>
    <div class="card-value">
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card-value {
    @apply flex h-[42px] items-center px-3 break-words;
}
</style>
