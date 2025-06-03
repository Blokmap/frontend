<script lang="ts" setup>
import BlokMap from '@/components/features/blokmap/BlokMap.vue';
import { ref } from 'vue';

const locations = ref([]);
</script>

<template>
    <BlokMap :locations="locations" />
</template>
