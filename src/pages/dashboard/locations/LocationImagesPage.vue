<script setup lang="ts">
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import { useLocationEditing } from '@/composables/store/useLocationEditing';

const editingStore = useLocationEditing();
</script>

<template>
    <LocationImagesBuilder v-model="editingStore.imagesForm" />
</template>
