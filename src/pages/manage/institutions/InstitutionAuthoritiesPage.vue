<script lang="ts" setup>
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useReadInstitutionAuthorities } from '@/composables/data/useAuthorities';
import type { Authority } from '@/domain/authority';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution?: Institution;
    isLoading: boolean;
    error?: Error | null;
}>();

const { locale } = useI18n();
const router = useRouter();

const institutionId = computed(() => props.institution?.id ?? 0);
const enabled = computed(() => !!props.institution?.id);

const filters = ref({});

const { data: authoritiesData, isLoading: authoritiesLoading } = useReadInstitutionAuthorities(
    institutionId,
    filters,
    { enabled },
);

const authorities = computed(() => authoritiesData.value?.data ?? []);

const institutionName = computed(() => {
    const name = props.institution?.name;
    if (!name) return 'Instelling';
    return name[locale.value] ?? name.nl ?? 'Instelling';
});

const breadcrumbs = computed(() => [
    {
        label: institutionName.value,
        to: { name: 'manage.institution.info' },
    },
    { label: 'Groepen' },
]);

const isDataLoading = computed(() => props.isLoading || authoritiesLoading.value);

function onAuthorityClick(authority: Authority) {
    router.push({
        name: 'manage.authority',
        params: { authorityId: authority.id },
    });
}
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle title="Groepen" />

        <p class="text-slate-600">Groepen (authorities) die onder deze instelling vallen.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van de groepen. Probeer het later opnieuw.
        </Callout>

        <!-- Empty State -->
        <EmptyState
            v-else-if="!isDataLoading && authorities.length === 0"
            :icon="faBuilding"
            title="Geen groepen"
            message="Er zijn nog geen groepen toegevoegd aan deze instelling.">
        </EmptyState>

        <!-- Data / Loading State -->
        <AuthorityTable
            v-else
            :authorities="authorities"
            :loading="isDataLoading"
            @click:authority="onAuthorityClick">
        </AuthorityTable>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
