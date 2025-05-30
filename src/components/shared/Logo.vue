<template>
    <div id="logo">BLOKMAP</div>
</template>

<style lang="scss" scoped>
#logo {
    border-radius: var(--border-radius-md);
    background: var(--primary-500);
    color: var(--primary-50);
    font-size: 24px;
    font-weight: bold;
    padding: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
}
</style>
