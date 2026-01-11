<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import Callout from '@/components/molecules/Callout.vue';
import EmptyState from '@/components/molecules/EmptyState.vue';
import LocationCardSkeleton from '@/components/molecules/location/LocationCardSkeleton.vue';
import LocationDetailCard from '@/components/molecules/location/LocationDetailCard.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReadAuthorityLocations } from '@/composables/data/useLocations';
import { getInstitutionName } from '@/domain/institution';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const { locale } = useI18n();

const authorityId = computed(() => props.authority.id);

const {
    data: locations,
    isLoading: locationsLoading,
    error,
} = useReadAuthorityLocations(authorityId);

const breadcrumbs = computed(() => {
    const institutionId = props.authority.institution?.id;
    const institutionName = getInstitutionName(props.authority.institution, locale.value);

    return [
        {
            label: institutionName,
            to: {
                name: 'manage.institution.overview',
                params: {
                    institutionId,
                },
            },
        },
        {
            label: props.authority?.name ?? 'Groep',
            to: {
                name: 'manage.authority.overview',
            },
        },
        { label: 'Locaties' },
    ];
});

const isDataLoading = computed(() => locationsLoading.value);
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <PageTitle title="Locaties" />

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
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
