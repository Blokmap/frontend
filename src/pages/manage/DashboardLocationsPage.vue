<script lang="ts" setup>
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import LocationDetailCard from '@/components/features/location/LocationDetailCard.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { faMapMarkerAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useReadProfileLocations } from '@/composables/data/useLocations';
import { usePagination } from '@/composables/usePagination';
import { type LocationFilter } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    profileId?: string;
    isOtherProfile: boolean;
}>();

const profileId = computed<string>(() => props.profileId ?? props.profile.id);

const filters = ref<LocationFilter>({
    page: 1,
    perPage: 20,
    query: '',
});

const { first, onPageChange } = usePagination(filters);

const {
    data: locations,
    isLoading,
    error,
} = useReadProfileLocations(profileId, filters, {
    includes: ['authority'],
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="[{ label: 'Mijn locaties' }]" :profile-id="profileId" />

        <PageTitle title="Mijn locaties" />

        <p class="text-slate-600">Locaties waar je rechtstreeks beherend lid van bent.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van je locaties. Probeer het later opnieuw.
        </Callout>

        <!-- Empty State -->
        <EmptyState
            v-else-if="!isLoading && locations?.data.length === 0"
            :icon="faMapMarkerAlt"
            title="Geen locaties"
            message="Je bent nog geen lid van een locatie.">
            <template #actions>
                <RouterLink :to="{ name: 'locations.submit' }">
                    <Button>
                        <FontAwesomeIcon :icon="faPlus" />
                        <span>Nieuwe locatie registreren</span>
                    </Button>
                </RouterLink>
            </template>
        </EmptyState>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="locations-grid">
            <LocationCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <!-- Data State -->
        <TransitionGroup v-else name="staggered-cards" tag="div" class="locations-grid" appear>
            <div
                v-for="(location, index) in locations?.data"
                :key="location.id"
                :style="{ '--i': index }"
                class="location-card-wrapper">
                <LocationDetailCard
                    :location="location"
                    :to="{
                        name: 'manage.location',
                        params: { locationId: location.id },
                    }">
                </LocationDetailCard>
            </div>
        </TransitionGroup>

        <Paginator
            :first="first(locations)"
            :rows="locations?.perPage"
            :total-records="locations?.total"
            @page="onPageChange">
        </Paginator>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.locations-grid {
    @apply grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4;

    .location-card-wrapper {
        @apply h-full;
    }
}
</style>
