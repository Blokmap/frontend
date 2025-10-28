<script setup lang="ts">
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { computed } from 'vue';
import type { Authority } from '@/domain/authority';

const props = defineProps<{
    authority: Authority;
}>();

// Use locations from the authority object if available
const locations = computed(() => props.authority.locations ?? []);
const isLoading = computed(() => false);
</script>

<template>
    <DashboardContent>
        <div class="space-y-6">
            <!-- Header -->
            <DashboardDetailHeader
                title="Locaties"
                secondary="Bekijk alle locaties die aan deze autoriteit zijn gekoppeld.">
            </DashboardDetailHeader>

            <!-- Locations List -->
            <LocationDataList :locations="locations" :loading="isLoading">
                <template #item="{ location }">
                    <LocationDataItem :location="location" />
                </template>
            </LocationDataList>
        </div>
    </DashboardContent>
</template>
