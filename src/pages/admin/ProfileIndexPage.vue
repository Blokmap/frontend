<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import ProfileActionMenu from '@/components/features/profile/ProfileActionMenu.vue';
import ProfileTable from '@/components/features/profile/table/ProfileTable.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import { debouncedWatch } from '@vueuse/core';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useReadProfiles, useUpdateProfileState } from '@/composables/data/useProfile';
import { usePagination } from '@/composables/usePagination';
import { ProfileState, type ProfileFilter } from '@/domain/profile';
import PageContent from '../PageContent.vue';
import PageFilters from '../PageFilters.vue';
import PageTitle from '../PageTitle.vue';

const router = useRouter();

const query = ref<string>('');

const filters = ref<ProfileFilter>({
    page: 1,
    perPage: 12,
    query: null,
    state: null,
    isAdmin: false,
});

const { first, onPageChange, resetPage } = usePagination(filters);

debouncedWatch(
    query,
    (newQuery) => {
        resetPage();
        filters.value.query = newQuery;
    },
    { debounce: 300 },
);

const { data: profiles, isLoading } = useReadProfiles(filters);

const { mutate: updateProfileState, isPending: isPendingStateUpdate } = useUpdateProfileState();

const onStateSelect = (profileId: string, state: ProfileState): void => {
    updateProfileState({
        profileId,
        state,
    });
};

const onLocationsClick = (profileId: string): void => {
    router.push({
        name: 'manage.locations',
        params: { profileId },
    });
};
</script>

<template>
    <PageContent>
        <PageTitle title="Profielen" />

        <PageFilters>
            <SearchField v-model="query" placeholder="Zoek profielen..." />
        </PageFilters>

        <ProfileTable :profiles="profiles?.data" :loading="isLoading">
            <template #actions="{ profile }">
                <ProfileActionMenu
                    :profile="profile"
                    :pending-actions="{
                        'select:state': isPendingStateUpdate,
                    }"
                    @select:state="onStateSelect"
                    @click:locations="onLocationsClick">
                </ProfileActionMenu>
            </template>
        </ProfileTable>

        <Paginator
            :first="first(profiles)"
            :rows="profiles?.perPage"
            :total-records="profiles?.total"
            @page="onPageChange">
        </Paginator>
    </PageContent>
</template>
