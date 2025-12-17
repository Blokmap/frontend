<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import AuthorityActionMenu from '@/components/features/authority/AuthorityActionMenu.vue';
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import { debouncedWatch } from '@vueuse/core';
import { ref } from 'vue';
import { useReadAuthorities } from '@/composables/data/useAuthorities';
import { usePagination } from '@/composables/usePagination';
import PageContent from '../PageContent.vue';
import PageFilters from '../PageFilters.vue';
import PageTitle from '../PageTitle.vue';
import type { AuthorityFilter } from '@/domain/authority';

const query = ref<string>('');

const filters = ref<AuthorityFilter>({
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
const { data: authorities, isPending: isPendingAuthorities } = useReadAuthorities(filters);
</script>

<template>
    <PageContent>
        <PageTitle title="Autoriteiten beheren" />

        <PageFilters>
            <SearchField v-model="query" placeholder="Zoek autoriteiten..." />
        </PageFilters>

        <AuthorityTable :authorities="authorities?.data" :loading="isPendingAuthorities">
            <template #actions="{ authority }">
                <AuthorityActionMenu :authority="authority" />
            </template>
        </AuthorityTable>

        <Paginator
            :first="first(authorities)"
            :rows="authorities?.perPage"
            :total-records="authorities?.total"
            @page="onPageChange">
        </Paginator>
    </PageContent>
</template>
