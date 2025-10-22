<script setup lang="ts">
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import { useLocationEditing } from '@/composables/store/useLocationEditing';

const editingStore = useLocationEditing();
</script>

<template>
    <DashboardContent>
        <LocationSettingsBuilder
            v-if="editingStore.locationForm"
            v-model:form="editingStore.locationForm" />
    </DashboardContent>
</template>
