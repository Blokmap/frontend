<script setup lang="ts">
import Paginator from 'primevue/paginator';
import LocationReportActionMenu from '@/components/features/location/LocationReportActionMenu.vue';
import LocationReportDataItem from '@/components/features/location/LocationReportDataItem.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DataList from '@/components/shared/molecules/datalist/DataList.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useDeleteLocationReport, useReadAllLocationReports } from '@/composables/data/useReports';
import { usePagination } from '@/composables/usePagination';
import type { Profile } from '@/domain/profile';

defineProps<{ profile: Profile }>();

const searchQuery = ref<string>('');

const filters = ref({
    query: '',
    page: 1,
    perPage: 10,
});

const { onPageChange, resetPage, first } = usePagination(filters);

const {
    data: reports,
    isFetching,
    isLoading,
} = useReadAllLocationReports(filters, {
    includes: ['createdBy'],
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
</script>

<template>
    <DashboardContent>
        <DashboardPageHeader :title="pageTitle">
            <template #metadata>
                <ResultSummary
                    :current-count="reports?.data.length"
                    :total-count="reports?.total"
                    :truncated="reports?.truncated"
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

        <DataList :items="reports?.data" :loading="isLoading">
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
        <Paginator
            :first="first(reports)"
            :rows="reports?.perPage"
            :total-records="reports?.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
