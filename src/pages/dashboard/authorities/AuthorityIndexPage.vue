<script setup lang="ts">
import Paginator from 'primevue/paginator';
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useReadAuthorities } from '@/composables/data/useAuthorities';
import { abbreviateCount } from '@/utils/format';
import type { Authority, AuthorityFilter } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

defineProps<{ profile: Profile }>();

const router = useRouter();

const filters = ref<AuthorityFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: authorities, isFetching, isLoading } = useReadAuthorities(filters);
const { data: counts } = useAdminCounts();

const searchQuery = ref<string>('');

const pageTitle = computed(
    () => `Alle Autoriteiten (${abbreviateCount(counts.value?.authorityCount) ?? '...'})`,
);

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
}, 300);

const onPageChange = (event: { page: number }): void => {
    filters.value.page = event.page + 1;
};

const onAuthorityClick = (authority: Authority) => {
    router.push({
        name: 'dashboard.authorities.detail.overview',
        params: { authorityId: authority.id },
    });
};

const onCreateAuthority = () => {
    router.push({ name: 'dashboard.authorities.create' });
};
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
            <DashboardPageHeader :title="pageTitle">
                <template #actions>
                    <PageHeaderButton
                        severity="secondary"
                        label="Nieuwe Autoriteit"
                        @click="onCreateAuthority">
                        <FontAwesomeIcon :icon="faPlus" />
                    </PageHeaderButton>
                </template>
                <template #metadata>
                    <ResultSummary
                        :current-count="authorities?.data.length"
                        :total-count="authorities?.total"
                        :truncated="authorities?.truncated"
                        empty-message="Geen autoriteiten gevonden.">
                    </ResultSummary>
                </template>
                <template #filters>
                    <SearchField
                        v-model="searchQuery"
                        placeholder="Zoek door alle autoriteiten..."
                        :loading="isFetching"
                        @input="onSearchChange">
                    </SearchField>
                </template>
            </DashboardPageHeader>

            <AuthorityTable
                :authorities="authorities?.data"
                :loading="isLoading"
                @click:authority="onAuthorityClick">
            </AuthorityTable>

            <Paginator
                v-if="authorities?.data.length"
                :total-records="counts?.authorityCount ?? 0"
                :rows="authorities.perPage"
                @page="onPageChange">
            </Paginator>
        </template>
    </DashboardContent>
</template>
