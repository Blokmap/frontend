<script setup lang="ts">
import Paginator from 'primevue/paginator';
import AuthorityActionMenu from '@/components/features/authority/AuthorityActionMenu.vue';
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import DashboardLoading from '@/layouts/manage/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/manage/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useDeleteAuthority, useReadAuthorities } from '@/composables/data/useAuthorities';
import { usePagination } from '@/composables/usePagination';
import { abbreviateCount } from '@/utils/formatUtils';
import type { Authority, AuthorityFilter } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

defineProps<{ profile: Profile }>();

const router = useRouter();

const searchQuery = ref<string>('');

const filters = ref<AuthorityFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { first, onPageChange, resetPage } = usePagination(filters);
const { mutateAsync: deleteAuthority } = useDeleteAuthority();
const { data: authorities, isFetching, isLoading } = useReadAuthorities(filters);

const { data: counts } = useAdminCounts();

const pageTitle = computed(
    () => `Alle Autoriteiten (${abbreviateCount(counts.value?.authorityCount) ?? '...'})`,
);

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    resetPage();
}, 300);

function onAuthorityClick(authority: Authority): void {
    router.push({
        name: 'dashboard.authorities.detail.overview',
        params: { authorityId: authority.id },
    });
}

function onAuthorityCreateClick(): void {
    router.push({ name: 'dashboard.authorities.create' });
}

function onAuthorityDeleteClick(authorityId: number): void {
    deleteAuthority(authorityId);
}
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
                        @click="onAuthorityCreateClick">
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
                <template #actions="{ authority }">
                    <AuthorityActionMenu
                        :authority="authority"
                        @click:delete="onAuthorityDeleteClick">
                    </AuthorityActionMenu>
                </template>
            </AuthorityTable>

            <Paginator
                :total-records="counts?.authorityCount"
                :first="first(authorities)"
                :rows="authorities?.perPage"
                @page="onPageChange">
            </Paginator>
        </template>
    </DashboardContent>
</template>
