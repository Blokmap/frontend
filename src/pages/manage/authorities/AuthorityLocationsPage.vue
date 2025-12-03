<script lang="ts" setup>
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import LocationDetailCard from '@/components/features/location/LocationDetailCard.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useReadAuthorityLocations } from '@/composables/data/useLocations';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority?: Authority;
    isLoading: boolean;
    error?: Error | null;
}>();

const authorityId = computed(() => props.authority?.id ?? 0);
const enabled = computed(() => !!props.authority?.id);

const { data: locations, isLoading: locationsLoading } = useReadAuthorityLocations(authorityId, {
    enabled,
});

const breadcrumbs = computed(() => [
    {
        label: props.authority?.name ?? 'Groep',
        to: { name: 'manage.authority.overview' },
    },
    { label: 'Locaties' },
]);

const isDataLoading = computed(() => props.isLoading || locationsLoading.value);
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle title="Locaties" />

        <p class="text-slate-600">Locaties die onder deze groep vallen.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van de locaties. Probeer het later opnieuw.
        </Callout>

        <!-- Empty State -->
        <EmptyState
            v-else-if="!isDataLoading && locations?.length === 0"
            :icon="faMapMarkerAlt"
            title="Geen locaties"
            message="Er zijn nog geen locaties toegevoegd aan deze groep.">
        </EmptyState>

        <!-- Data / Loading State -->
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <template v-if="isDataLoading">
                <LocationCardSkeleton v-for="i in 6" :key="i" />
            </template>
            <template v-else>
                <LocationDetailCard
                    v-for="location in locations"
                    :key="location.id"
                    :location="location"
                    :to="{
                        name: 'manage.location',
                        params: { locationId: location.id },
                    }">
                </LocationDetailCard>
            </template>
        </div>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
