<script setup lang="ts">
import Paginator from 'primevue/paginator';
import ProfileDataTable from '@/components/features/profile/ProfileDataTable.vue';
import SearchField from '@/components/shared/filter/SearchField.vue';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useProfiles } from '@/composables/data/useProfile';
import { abbreviateCount } from '@/utils/format';
import type { Profile, ProfileFilter } from '@/domain/profile';

// const router = useRouter();

const searchQuery = ref<string>('');

const filters = ref<ProfileFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: profiles, isFetching, isLoading } = useProfiles(filters);

const { data: counts } = useAdminCounts();

const onPageChange = (event: { page: number }): void => {
    filters.value.page = event.page + 1;
};

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    filters.value.page = 1;
}, 300);

const onProfileClick = (profile: Profile) => {
    console.log('Profile clicked:', profile);
};
</script>

<template>
    <div class="flex items-end justify-between gap-3">
        <div class="space-y-2">
            <h1 class="text-3xl font-bold">
                Alle Profielen ({{ abbreviateCount(counts?.profileCount) ?? '...' }})
            </h1>

            <p class="text-sm font-normal text-slate-700">
                <template v-if="profiles?.total">
                    {{ profiles?.data.length ?? '...' }} van {{ profiles?.total ?? '...' }}
                    <template v-if="profiles?.truncated">+</template> resultaten getoond.
                </template>
                <template v-else> Geen profielen gevonden. </template>
            </p>
        </div>
        <SearchField
            v-model="searchQuery"
            placeholder="Zoek door alle profielen..."
            :loading="isFetching"
            @input="onSearchChange">
        </SearchField>
    </div>

    <ProfileDataTable
        :profiles="profiles?.data"
        :loading="isLoading"
        @click:profile="onProfileClick">
    </ProfileDataTable>

    <Paginator
        v-if="profiles?.data?.length"
        :first="profiles.perPage * (profiles.page - 1)"
        :rows="profiles.perPage"
        :total-records="profiles.total"
        @page="onPageChange">
    </Paginator>
</template>
