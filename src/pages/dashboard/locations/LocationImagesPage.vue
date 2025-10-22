<script setup lang="ts">
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import { useLocationEditing } from '@/composables/store/useLocationEditing';

const editingStore = useLocationEditing();
</script>

<template>
    <DashboardContent>
        <LocationImagesBuilder v-model="editingStore.imagesForm" />
    </DashboardContent>
</template>
