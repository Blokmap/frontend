<script setup lang="ts">
import Paginator from 'primevue/paginator';
import ProfileTable from '@/components/features/profile/ProfileTable.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useProfiles, useProfileState } from '@/composables/data/useProfile';
import { useToast } from '@/composables/store/useToast';
import { abbreviateCount } from '@/utils/format';
import type { Profile, ProfileFilter, ProfileState } from '@/domain/profile';

const router = useRouter();
const toast = useToast();

const searchQuery = ref<string>('');

const filters = ref<ProfileFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: profiles, refetch, isFetching, isLoading } = useProfiles(filters);

const {
    mutateAsync: updateProfileState,
    isPending: isUpdatingProfile,
    variables: updateVariables,
} = useProfileState();

const { data: counts } = useAdminCounts();

const isProfilePending = (profileId: number): boolean => {
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
    router.push({ name: 'profiles.detail', params: { profileId: profile.id } });
}

/**
 * Handle changing the status of a profile (enable/disable).
 * @param profileId The ID of the profile to update.
 * @param status The new status to set.
 */
async function onChangeProfileStatus(profileId: number, status: ProfileState) {
    await updateProfileState({ profileId, state: status });
    await refetch();

    const statusLabel = status === 'disabled' ? 'geblokkeerd' : 'geactiveerd';
    toast.add({
        severity: 'success',
        summary: 'Status Bijgewerkt',
        detail: `Profiel werd succesvol ${statusLabel}!`,
    });
}
</script>

<template>
    <div class="flex items-center justify-between gap-3">
        <div class="space-y-2">
            <h1 class="text-3xl font-bold">
                Alle Profielen ({{ abbreviateCount(counts?.profileCount) ?? '...' }})
            </h1>

            <ResultSummary
                :current-count="profiles?.data.length"
                :total-count="profiles?.total"
                :truncated="profiles?.truncated"
                empty-message="Geen profielen gevonden.">
            </ResultSummary>
        </div>
    </div>

    <div class="flex gap-3">
        <SearchField
            v-model="searchQuery"
            placeholder="Zoek door alle profielen..."
            :loading="isFetching"
            @input="onSearchChange">
        </SearchField>
    </div>

    <ProfileTable
        :profiles="profiles?.data"
        :loading="isLoading"
        :is-profile-pending="isProfilePending"
        @click:profile="onProfileClick"
        @change:status="onChangeProfileStatus">
    </ProfileTable>

    <Paginator
        v-if="profiles?.data?.length"
        :first="profiles.perPage * (profiles.page - 1)"
        :rows="profiles.perPage"
        :total-records="profiles.total"
        @page="onPageChange">
    </Paginator>
</template>
