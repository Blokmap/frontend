<script setup lang="ts">
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import InstitutionTable from '@/components/features/institution/InstitutionTable.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DashboardLoading from '@/components/shared/molecules/DashboardLoading.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useReadInstitutions } from '@/composables/data/useInstitutions';
import { abbreviateCount } from '@/utils/format';
import type { Institution, InstitutionFilter } from '@/domain/institution';

const searchQuery = ref<string>('');

const filters = ref<InstitutionFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: institutions, isFetching, isLoading } = useReadInstitutions(filters);
const { data: counts } = useAdminCounts();

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
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <template v-else>
        <div class="flex items-center justify-between gap-3">
            <div class="space-y-2">
                <h1 class="text-3xl font-bold">
                    Alle Instituties ({{ abbreviateCount(counts?.institutionCount) ?? '...' }})
                </h1>
                <ResultSummary
                    :current-count="institutions?.data.length"
                    :total-count="institutions?.total"
                    :truncated="institutions?.truncated"
                    empty-message="Geen instituties gevonden.">
                </ResultSummary>
            </div>
            <Button severity="secondary" @click="onCreateInstitution">
                <FontAwesomeIcon :icon="faPlus" />
                Nieuwe Institutie
            </Button>
        </div>

        <div class="flex gap-3">
            <SearchField
                v-model="searchQuery"
                placeholder="Zoek door alle instellingen..."
                :loading="isFetching"
                @input="onSearchChange">
            </SearchField>
        </div>

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
</template>
