<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import InstitutionActionMenu from '@/components/features/institution/InstitutionActionMenu.vue';
import InstitutionTable from '@/components/features/institution/InstitutionTable.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import { debouncedWatch } from '@vueuse/core';
import { ref } from 'vue';
import { useReadInstitutions } from '@/composables/data/useInstitutions';
import { usePagination } from '@/composables/usePagination';
import PageContent from '../PageContent.vue';
import PageFilters from '../PageFilters.vue';
import PageTitle from '../PageTitle.vue';
import type { InstitutionFilter } from '@/domain/institution';

const query = ref<string>('');

const filters = ref<InstitutionFilter>({
    page: 1,
    perPage: 12,
    query: null,
});

debouncedWatch(
    query,
    (newQuery: string) => {
        resetPage();
        filters.value.query = newQuery;
    },
    { debounce: 300 },
);

const { first, onPageChange, resetPage } = usePagination(filters);
const { data: institutions, isPending: isPendingInstitutions } = useReadInstitutions(filters);
</script>

<template>
    <PageContent>
        <PageTitle title="Organisaties" />

        <PageFilters>
            <SearchField v-model="query" placeholder="Zoek organisaties..." />
        </PageFilters>

        <InstitutionTable :institutions="institutions?.data" :loading="isPendingInstitutions">
            <template #actions="{ institution }">
                <InstitutionActionMenu :institution="institution" />
            </template>
        </InstitutionTable>

        <Paginator
            :first="first(institutions)"
            :rows="institutions?.perPage"
            :total-records="institutions?.total"
            @page="onPageChange">
        </Paginator>
    </PageContent>
</template>
