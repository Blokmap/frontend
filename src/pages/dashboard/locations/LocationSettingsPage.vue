<script setup lang="ts">
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import { useLocationEditing } from '@/composables/store/useLocationEditing';

const editingStore = useLocationEditing();
</script>

<template>
    <LocationSettingsBuilder
        v-if="editingStore.locationForm"
        v-model:form="editingStore.locationForm" />
</template>
