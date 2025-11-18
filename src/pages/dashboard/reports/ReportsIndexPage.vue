<script setup lang="ts">
import Paginator from 'primevue/paginator';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';

import AuthorityReportDataItem from '@/components/features/authority/AuthorityReportDataItem.vue';
import LocationReportActionMenu from '@/components/features/location/LocationReportActionMenu.vue';
import LocationReportDataItem from '@/components/features/location/LocationReportDataItem.vue';
import ProfileReportDataItem from '@/components/features/profile/ProfileReportDataItem.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DataList from '@/components/shared/molecules/datalist/DataList.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';

import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';

import {
    useDeleteLocationReport,
    useReadAllAuthorityReports,
    useReadAllLocationReports,
    useReadAllProfileReports,
} from '@/composables/data/useReports';
import { usePagination } from '@/composables/usePagination';

import type { Profile } from '@/domain/profile';

defineProps<{ profile: Profile }>();

const activeTab = ref('0');

const searchQuery = ref<string>('');

const filters = ref({
    query: '',
    page: 1,
    perPage: 10,
});

const { onPageChange, resetPage, first } = usePagination(filters);

const locationReportsEnabled = computed(() => activeTab.value === '0');
const authorityReportsEnabled = computed(() => activeTab.value === '1');
const profileReportsEnabled = computed(() => activeTab.value === '2');

const {
    data: locationReports,
    isFetching: isFetchingLocationReports,
    isLoading: isLoadingLocationReports,
} = useReadAllLocationReports(filters, {
    includes: ['createdBy'],
    enabled: locationReportsEnabled,
});

const {
    data: authorityReports,
    isFetching: isFetchingAuthorityReports,
    isLoading: isLoadingAuthorityReports,
} = useReadAllAuthorityReports(filters, {
    includes: ['createdBy'],
    enabled: authorityReportsEnabled,
});

const {
    data: profileReports,
    isFetching: isFetchingProfileReports,
    isLoading: isLoadingProfileReports,
} = useReadAllProfileReports(filters, {
    includes: ['createdBy'],
    enabled: profileReportsEnabled,
});

const currentReports = computed(() => {
    if (activeTab.value === '0') return locationReports.value;
    if (activeTab.value === '1') return authorityReports.value;
    return profileReports.value;
});

const isFetching = computed(() => {
    if (activeTab.value === '0') return isFetchingLocationReports.value;
    if (activeTab.value === '1') return isFetchingAuthorityReports.value;
    return isFetchingProfileReports.value;
});

const pageTitle = computed(() => 'Meldingen');

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    resetPage();
}, 300);

const {
    mutateAsync: deleteReport,
    isPending: isDeletingReport,
    variables: deleteVariables,
} = useDeleteLocationReport();

function isReportPending(locationId: number, reportId: number): boolean {
    return (
        isDeletingReport.value &&
        deleteVariables.value?.locationId === locationId &&
        deleteVariables.value?.reportId === reportId
    );
}

function onDeleteReport(locationId: number, reportId: number) {
    deleteReport({ locationId, reportId });
}

function onTabChange() {
    resetPage();
    searchQuery.value = '';
    filters.value.query = '';
}
</script>

<template>
    <DashboardContent>
        <DashboardPageHeader :title="pageTitle">
            <template #metadata>
                <ResultSummary
                    :current-count="currentReports?.data.length"
                    :total-count="currentReports?.total"
                    :truncated="currentReports?.truncated"
                    :empty-message="'Geen meldingen gevonden'">
                </ResultSummary>
            </template>
            <template #filters>
                <div class="flex flex-col gap-3 sm:flex-row">
                    <SearchField
                        v-model="searchQuery"
                        placeholder="Zoek meldingen..."
                        :loading="isFetching"
                        @input="onSearchChange">
                    </SearchField>
                </div>
            </template>
        </DashboardPageHeader>

        <Tabs v-model:value="activeTab" @update:value="onTabChange">
            <TabList>
                <Tab value="0">Locaties</Tab>
                <Tab value="1">Autoriteiten</Tab>
                <Tab value="2">Profielen</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <DataList :items="locationReports?.data" :loading="isLoadingLocationReports">
                        <template #item="{ item: report }">
                            <LocationReportDataItem :report="report">
                                <template #actions>
                                    <LocationReportActionMenu
                                        :report="report"
                                        :is-pending="isReportPending(report.location.id, report.id)"
                                        @click:delete="onDeleteReport">
                                    </LocationReportActionMenu>
                                </template>
                            </LocationReportDataItem>
                        </template>
                    </DataList>
                </TabPanel>
                <TabPanel value="1">
                    <DataList :items="authorityReports?.data" :loading="isLoadingAuthorityReports">
                        <template #item="{ item: report }">
                            <AuthorityReportDataItem :report="report" />
                        </template>
                    </DataList>
                </TabPanel>
                <TabPanel value="2">
                    <DataList :items="profileReports?.data" :loading="isLoadingProfileReports">
                        <template #item="{ item: report }">
                            <ProfileReportDataItem :report="report" />
                        </template>
                    </DataList>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <Paginator
            :first="first(currentReports)"
            :rows="currentReports?.perPage"
            :total-records="currentReports?.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
