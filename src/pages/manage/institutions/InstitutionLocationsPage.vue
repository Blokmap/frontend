<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import LocationDetailCard from '@/components/features/location/LocationDetailCard.vue';
import LocationStateSelect from '@/components/features/location/forms/LocationStateSelect.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import Breadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import PageFilters from '@/components/shared/organisms/PageFilters.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { debouncedWatch } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReadInstitutionLocations } from '@/composables/data/useLocations';
import { usePagination } from '@/composables/usePagination';
import { type LocationFilter } from '@/domain/location';
import type { Institution } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
}>();

const { locale } = useI18n();

const filters = ref<LocationFilter>({
    perPage: 10,
    page: 1,
    query: null,
    state: null,
});

const isFiltering = computed(() => {
    return !!filters.value.query || !!filters.value.state;
});

const { first, onPageChange, resetPage } = usePagination(filters);

const query = ref<string>('');

debouncedWatch(
    query,
    (newQuery) => {
        resetPage();
        filters.value.query = newQuery;
    },
    { debounce: 300 },
);

const institutionId = computed<number>(() => props.institution.id);

const {
    data: locations,
    isLoading,
    isFetching,
    error,
} = useReadInstitutionLocations(institutionId, filters);

const breadcrumbs = computed(() => {
    const institutionName = props.institution.name[locale.value];

    return [
        { label: 'Organisaties', to: { name: 'manage' } },
        {
            label: institutionName,
            to: {
                name: 'manage.institution.info',
                params: {
                    institutionId: props.institution.id,
                },
            },
        },
        { label: 'Beheerders' },
    ];
});
</script>

<template>
    <PageContent>
        <Breadcrumb :items="breadcrumbs" />

        <PageTitle title="Locaties"> </PageTitle>

        <PageFilters>
            <SearchField v-model="query" :loading="isFetching" />
            <LocationStateSelect v-model="filters.state" />
        </PageFilters>

        <p class="text-slate-600">Locaties die onder deze organisatie vallen.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van de locaties. Probeer het later opnieuw.
        </Callout>

        <!-- Empty State -->
        <EmptyState
            v-else-if="!isLoading && locations?.data?.length === 0"
            :icon="faMapMarkerAlt"
            title="Geen locaties gevonden">
            <template #message>
                <span v-if="isFiltering">
                    Er zijn geen locaties die voldoen aan de zoekcriteria.
                </span>
                <span v-else> Er zijn nog geen locaties toegevoegd aan deze organisatie. </span>
            </template>
        </EmptyState>

        <!-- Data / Loading State -->
        <template v-else>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <template v-if="isLoading">
                    <LocationCardSkeleton v-for="i in 6" :key="i" />
                </template>
                <template v-else>
                    <LocationDetailCard
                        v-for="location in locations?.data"
                        :key="location.id"
                        :location="location"
                        :to="{
                            name: 'manage.location',
                            params: { locationId: location.id },
                        }">
                    </LocationDetailCard>
                </template>
            </div>

            <Paginator
                :first="first(locations)"
                :rows="locations?.perPage"
                :total-records="locations?.total"
                @page="onPageChange">
            </Paginator>
        </template>
    </PageContent>
</template>
