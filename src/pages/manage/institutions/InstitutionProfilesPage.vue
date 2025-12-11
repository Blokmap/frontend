<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import ProfileAddDialog from '@/components/features/profile/ProfileAddDialog.vue';
import ProfileStateSelect from '@/components/features/profile/forms/ProfileStateSelect.vue';
import ProfileTable from '@/components/features/profile/table/ProfileTable.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import ManageBreadcrumb, {
    type BreadcrumbItem,
} from '@/components/shared/molecules/Breadcrumb.vue';
import PageFilters from '@/components/shared/organisms/PageFilters.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import ManagementLoaderError from '@/layouts/manage/ManagementLoaderError.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useAddInstitutionProfile,
    useReadInstitutionProfiles,
} from '@/composables/data/useProfile';
import { usePagination } from '@/composables/usePagination';
import { type Profile, type ProfileFilter } from '@/domain/profile';
import type { Institution } from '@/domain/institution';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const institutionId = computed(() => props.institution.id);

const searchQuery = ref<string>('');

const filters = ref<ProfileFilter>({
    page: 1,
    perPage: 10,
    query: null,
    state: null,
});

const { locale } = useI18n();
const { first, onPageChange, resetPage } = usePagination(filters);

const {
    data: profiles,
    isFetching: isFetchingProfiles,
    isLoading: isLoadingProfiles,
    isError: isProfilesError,
    error: profilesError,
} = useReadInstitutionProfiles(institutionId, filters);

const showProfileAddDialog = ref<boolean>(false);

const { mutate: addInstitutionProfile, isPending: isAddingProfile } = useAddInstitutionProfile(
    institutionId,
    {
        onSuccess: () => {
            showProfileAddDialog.value = false;
        },
    },
);

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    resetPage();
}, 300);

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const institutionName = props.institution.name[locale.value];

    return [
        {
            label: institutionName,
            to: {
                name: 'manage.institution.info',
            },
        },
        {
            label: 'Leden',
        },
    ];
});

const isFetching = computed(() => {
    return isFetchingProfiles.value;
});

const isError = computed(() => {
    return isProfilesError.value;
});

const isLoading = computed(() => {
    return isLoadingProfiles.value;
});

const isFiltering = computed(() => {
    return filters.value.query != null || filters.value.state != null;
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Leden">
            <template #actions>
                <PageHeaderButton
                    severity="primary"
                    label="Lid Toevoegen"
                    @click="showProfileAddDialog = true">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </PageTitle>

        <PageFilters :is-filtering="isFiltering">
            <SearchField
                v-model="searchQuery"
                :placeholder="$t('pages.manage.institution.profiles.search')"
                :loading="isFetching"
                @input="onSearchChange">
            </SearchField>
            <ProfileStateSelect v-model:status="filters.state" />
        </PageFilters>

        <p class="text-slate-600">
            Profielen die met een account verbonden zijn aan deze instelling en hebben ingelogd op
            Blokmap.
        </p>

        <ManagementLoaderError v-if="isError" :errors="[profilesError]" />

        <ProfileTable v-else :profiles="profiles?.data" :loading="isLoading" hide-institution>
        </ProfileTable>

        <Paginator
            :first="first(profiles)"
            :rows="profiles?.perPage"
            :total-records="profiles?.total"
            @page="onPageChange">
        </Paginator>

        <Teleport to="body">
            <ProfileAddDialog
                v-model:visible="showProfileAddDialog"
                :pending="isAddingProfile"
                @click:submit="addInstitutionProfile">
            </ProfileAddDialog>
        </Teleport>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
