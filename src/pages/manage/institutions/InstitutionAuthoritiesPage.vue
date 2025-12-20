<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import ManageBreadcrumb, {
    type BreadcrumbItem,
} from '@/components/shared/molecules/Breadcrumb.vue';
import LoaderError from '@/layouts/LoaderError.vue';
import PageContent from '@/pages/PageContent.vue';
import PageTitle from '@/pages/PageTitle.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useReadInstitutionAuthorities } from '@/composables/data/useAuthorities';
import { usePagination } from '@/composables/usePagination';
import { type AuthorityFilter, type Authority } from '@/domain/authority';
import { getInstitutionName, type Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const { locale } = useI18n();
const router = useRouter();

const institutionId = computed(() => props.institution.id);

const filters = ref<AuthorityFilter>({
    page: 1,
    perPage: 10,
});

const { first, onPageChange } = usePagination(filters);

const {
    data: authorities,
    isLoading: isLoadingAuthorities,
    isError: isAuthoritiesError,
    error: authoritiesError,
} = useReadInstitutionAuthorities(institutionId, filters);

const isError = computed(() => {
    return isAuthoritiesError.value;
});

const isLoading = computed(() => {
    return isLoadingAuthorities.value;
});

function onAuthorityClick(authority: Authority) {
    router.push({
        name: 'manage.authority',
        params: { authorityId: authority.id },
    });
}
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const institutionName = getInstitutionName(props.institution, locale.value);

    return [
        {
            label: institutionName,
            to: {
                name: 'manage.institution.info',
            },
        },
        {
            label: 'Groepen',
        },
    ];
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Groepen" />

        <p class="text-slate-600">Groepen die onder deze instelling vallen.</p>

        <LoaderError v-if="isError" :errors="[authoritiesError]" />

        <AuthorityTable
            v-else
            :authorities="authorities?.data"
            :loading="isLoading"
            @click:authority="onAuthorityClick"
            hide-institution-column>
        </AuthorityTable>

        <Paginator
            :first="first(authorities)"
            :rows="authorities?.perPage"
            :total-records="authorities?.total"
            @page="onPageChange">
        </Paginator>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
