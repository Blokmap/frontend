<script setup lang="ts">
import Paginator from 'primevue/paginator';
import ProfileActionMenu from '@/components/features/profile/ProfileActionMenu.vue';
import ProfileStateBadge from '@/components/features/profile/ProfileStateBadge.vue';
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { usePagination } from '@/composables/data/usePagination';
import { useReadProfiles, useUpdateProfileState } from '@/composables/data/useProfile';
import { abbreviateCount } from '@/utils/format';
import type { Profile, ProfileFilter } from '@/domain/profile';

const router = useRouter();
const { t } = useI18n();

const filters = ref<ProfileFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: profiles, refetch, isFetching, isLoading } = useReadProfiles(filters);
const { onPageChange, resetPage, first } = usePagination(filters);

const {
    mutateAsync: updateProfileState,
    isPending: isUpdatingProfile,
    variables: updateVariables,
} = useUpdateProfileState({
    onSuccess: async () => {
        await refetch();
    },
    onError: (error: any) => {
        // Error toast is handled in the composable
        console.error('Failed to update profile state:', error);
    },
});

const { data: counts } = useAdminCounts();

const pageTitle = computed(() =>
    t('pages.dashboard.profiles.index.title', [
        abbreviateCount(counts.value?.profileCount) ?? '...',
    ]),
);

const isProfilePending = (profileId: string): boolean => {
    return isUpdatingProfile.value && updateVariables.value?.profileId === profileId;
};

const onSearchChange = useDebounceFn((event: InputEvent) => {
    const input = event.data;

    if (input) {
        filters.value.query = input;
        resetPage();
    }
}, 300);

/**
 * Handle clicking on a profile to view its details.
 * @param profile The profile that was clicked.
 */
function onProfileClick(profile: Profile): void {
    router.push({ name: 'dashboard.profiles.detail.overview', params: { profileId: profile.id } });
}

/**
 * Handle selecting a new state for a profile.
 *
 * @param profileId - The ID of the profile.
 * @param state - The new state to set.
 */
function onSelectProfileState(profileId: string, state: string): void {
    updateProfileState({ profileId, state: state as Profile['state'] });
}
</script>

<template>
    <DashboardContent>
        <DashboardPageHeader :title="pageTitle">
            <template #metadata>
                <ResultSummary
                    :current-count="profiles?.data.length"
                    :total-count="profiles?.total"
                    :truncated="profiles?.truncated"
                    :empty-message="$t('pages.dashboard.profiles.index.empty')">
                </ResultSummary>
            </template>
            <template #filters>
                <SearchField
                    :placeholder="$t('pages.dashboard.profiles.index.search')"
                    :loading="isFetching"
                    @input="onSearchChange">
                </SearchField>
            </template>
        </DashboardPageHeader>

        <Table :value="profiles?.data" :loading="isLoading" @click:row="onProfileClick">
            <template #row="{ data: profile }">
                <TableCell column="Profiel">
                    <ProfileTableCell :profile="profile" />
                </TableCell>

                <TableCell column="E-mailadres">
                    {{ profile.email }}
                </TableCell>

                <TableCell column="Institutie">
                    {{ profile.institution?.name || '-' }}
                </TableCell>

                <TableCell column="Status">
                    <ProfileStateBadge :profile="profile" />
                </TableCell>

                <TableCell column="Acties">
                    <ProfileActionMenu
                        :profile="profile"
                        :is-pending="isProfilePending(profile.id)"
                        @select:state="onSelectProfileState(profile.id, $event)">
                    </ProfileActionMenu>
                </TableCell>
            </template>
        </Table>

        <Paginator
            v-if="profiles?.data?.length"
            :first="first"
            :rows="profiles.perPage"
            :total-records="profiles.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
