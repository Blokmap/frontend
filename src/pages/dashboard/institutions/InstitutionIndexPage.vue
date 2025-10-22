<script setup lang="ts">
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import InstitutionTable from '@/components/features/institution/InstitutionTable.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useReadInstitutions } from '@/composables/data/useInstitutions';
import { abbreviateCount } from '@/utils/format';
import type { Institution, InstitutionFilter } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

defineProps<{ profile: Profile }>();

const filters = ref<InstitutionFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: institutions, isFetching, isLoading } = useReadInstitutions(filters);
const { data: counts } = useAdminCounts();

const searchQuery = ref<string>('');

const pageTitle = computed(
    () => `Alle Instituties (${abbreviateCount(counts.value?.institutionCount) ?? '...'})`,
);

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
}, 300);

const onPageChange = (event: { page: number }): void => {
    filters.value.page = event.page + 1;
};

const onInstitutionClick = (institution: Institution) => {
    console.log('Institution clicked:', institution);
};

const onCreateInstitution = () => {
    console.log('Create institution clicked');
};
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
            <DashboardPageHeader :title="pageTitle">
                <template #actions>
                    <Button severity="secondary" @click="onCreateInstitution">
                        <FontAwesomeIcon :icon="faPlus" />
                        Nieuwe Institutie
                    </Button>
                </template>
                <template #metadata>
                    <ResultSummary
                        :current-count="institutions?.data.length"
                        :total-count="institutions?.total"
                        :truncated="institutions?.truncated"
                        empty-message="Geen instituties gevonden.">
                    </ResultSummary>
                </template>
                <template #filters>
                    <SearchField
                        v-model="searchQuery"
                        placeholder="Zoek door alle instellingen..."
                        :loading="isFetching"
                        @input="onSearchChange">
                    </SearchField>
                </template>
            </DashboardPageHeader>

            <InstitutionTable
                :institutions="institutions?.data"
                :loading="isLoading"
                @click:institution="onInstitutionClick">
            </InstitutionTable>

            <Paginator
                v-if="institutions?.data.length"
                :total-records="counts?.institutionCount ?? 0"
                :rows="institutions.perPage"
                @page="onPageChange">
            </Paginator>
        </template>
    </DashboardContent>
</template>
