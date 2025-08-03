<script setup lang="ts">
import Logo from '@/components/shared/Logo.vue';
import Dropdown from 'primevue/dropdown';
import { ref } from 'vue';

const selectedAuthority = ref();
const authorities = ref([
    { label: 'Admin', value: 'admin' },
    { label: 'Institution Manager', value: 'manager' },
    { label: 'Viewer', value: 'viewer' },
]);
</script>

<template>
    <nav class="flex w-64 flex-col justify-between bg-white"></nav>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
