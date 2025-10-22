<script setup lang="ts">
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import { useLocationEditing } from '@/composables/store/useLocationEditing';

const editingStore = useLocationEditing();
</script>

<template>
    <DashboardContent>
        <LocationInformationBuilder
            v-if="editingStore.locationForm"
            v-model="editingStore.locationForm" />
    </DashboardContent>
</template>
