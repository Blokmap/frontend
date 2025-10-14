<script setup lang="ts">
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import { useLocationEditing } from '@/composables/store/useLocationEditing';

const editingStore = useLocationEditing();
</script>

<template>
    <LocationInformationBuilder
        v-if="editingStore.locationForm"
        v-model="editingStore.locationForm" />
</template>
