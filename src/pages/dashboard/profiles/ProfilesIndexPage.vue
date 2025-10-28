<script setup lang="ts">
import Paginator from 'primevue/paginator';
import ProfileActionsMenu from '@/components/features/profile/ProfileActionsMenu.vue';
import ProfileStateBadge from '@/components/features/profile/ProfileStateBadge.vue';
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useReadProfiles, useUpdateProfileState } from '@/composables/data/useProfile';
import { abbreviateCount } from '@/utils/format';
import type { Profile, ProfileFilter, ProfileState } from '@/domain/profile';

const router = useRouter();
const { t } = useI18n();

const searchQuery = ref<string>('');

const filters = ref<ProfileFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: profiles, refetch, isFetching, isLoading } = useReadProfiles(filters);

const {
    mutateAsync: updateProfileState,
    isPending: isUpdatingProfile,
    variables: updateVariables,
} = useUpdateProfileState();

const { data: counts } = useAdminCounts();

const pageTitle = computed(() =>
    t('pages.dashboard.profiles.index.title', [
        abbreviateCount(counts.value?.profileCount) ?? '...',
    ]),
);

const isProfilePending = (profileId: string): boolean => {
    return isUpdatingProfile.value && updateVariables.value?.profileId === profileId;
};

const onPageChange = (event: { page: number }): void => {
    filters.value.page = event.page + 1;
};

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    filters.value.page = 1;
}, 300);

/**
 * Handle clicking on a profile to view its details.
 * @param profile The profile that was clicked.
 */
function onProfileClick(profile: Profile): void {
    router.push({ name: 'dashboard.profiles.detail.overview', params: { profileId: profile.id } });
}

/**
 * Handle changing the status of a profile (enable/disable).
 * @param profileId The ID of the profile to update.
 * @param status The new status to set.
 */
async function onChangeProfileStatus(profileId: string, status: ProfileState) {
    await updateProfileState({ profileId, state: status });
    refetch();
}
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
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
                        v-model="searchQuery"
                        :placeholder="$t('pages.dashboard.profiles.index.search')"
                        :loading="isFetching"
                        @input="onSearchChange">
                    </SearchField>
                </template>
            </DashboardPageHeader>

            <Table :value="profiles?.data" @click:row="onProfileClick">
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
                        <ProfileActionsMenu
                            :profile="profile"
                            :is-pending="isProfilePending(profile.id)"
                            @change:status="onChangeProfileStatus">
                        </ProfileActionsMenu>
                    </TableCell>
                </template>
            </Table>

            <Paginator
                v-if="profiles?.data?.length"
                :first="profiles.perPage * (profiles.page - 1)"
                :rows="profiles.perPage"
                :total-records="profiles.total"
                @page="onPageChange">
            </Paginator>
        </template>
    </DashboardContent>
</template>
