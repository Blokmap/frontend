<script setup lang="ts">
import Paginator from 'primevue/paginator';
import ProfileTable from '@/components/features/profile/table/ProfileTable.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useReadInstitutionProfiles } from '@/composables/data/useProfile';
import { usePagination } from '@/composables/usePagination';
import type { Institution } from '@/domain/institution';
import type { ProfileFilter } from '@/domain/profile';

const props = defineProps<{
    institution: Institution;
}>();

const filters = ref<ProfileFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { onPageChange, first, resetPage } = usePagination(filters);

const {
    data: profiles,
    isLoading,
    isFetching,
} = useReadInstitutionProfiles(
    computed(() => props.institution.id),
    filters,
);

const onSearchChange = useDebounceFn((event: InputEvent) => {
    resetPage(false);
    filters.value.query = event.data;
}, 300);
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader
            title="Gebruikers"
            secondary="Bekijk gebruikers onder deze institutie">
        </DashboardDetailHeader>

        <SearchField
            :placeholder="$t('pages.dashboard.profiles.index.search')"
            :loading="isFetching"
            @input="onSearchChange">
        </SearchField>

        <!-- Profile Table -->
        <ProfileTable :profiles="profiles?.data" :loading="isLoading" />

        <Paginator
            :first="first(profiles)"
            :rows="profiles?.perPage"
            :total-records="profiles?.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
