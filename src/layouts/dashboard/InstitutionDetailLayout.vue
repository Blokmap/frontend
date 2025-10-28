<script setup lang="ts">
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faBuilding, faList, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReadInstitutions } from '@/composables/data/useInstitutions';
import type { Institution } from '@/domain/institution';

const props = defineProps<{
    institutionId: string;
}>();

const { locale } = useI18n();

const institutionSlug = computed(() => props.institutionId);

const {
    data: institutionData,
    isLoading,
    error,
} = useReadInstitutions(computed(() => ({ query: institutionSlug.value })));

const institution = computed<Institution | undefined>(() => {
    // Find the institution that matches the slug
    return institutionData.value?.data?.find((inst) => inst.slug === institutionSlug.value);
});

const tabs = computed<TabItem[]>(() => [
    {
        value: 'overview',
        label: 'Overzicht',
        icon: faList,
        route: {
            name: 'dashboard.institutions.detail.overview',
            params: { institutionId: props.institutionId },
        },
    },
    {
        value: 'users',
        label: 'Gebruikers',
        icon: faUsers,
        route: {
            name: 'dashboard.institutions.detail.users',
            params: { institutionId: props.institutionId },
        },
    },
    {
        value: 'authorities',
        label: 'Autoriteiten',
        icon: faBuilding,
        route: {
            name: 'dashboard.institutions.detail.authorities',
            params: { institutionId: props.institutionId },
        },
    },
]);
</script>

<template>
    <DashboardContent>
        <!-- Loading State -->
        <DashboardLoading v-if="isLoading" />

        <!-- Not Found State -->
        <DashboardNotFound
            v-else-if="!institution || error"
            title="Institutie Niet Gevonden"
            message="De institutie die je zoekt bestaat niet of je hebt geen toegang.">
        </DashboardNotFound>

        <!-- Content -->
        <template v-else>
            <!-- Institution Header -->
            <DashboardDetailHeader
                :title="institution?.name[locale] ?? undefined"
                :primary="institution?.slug"
                :secondary="institution?.email ?? undefined">
                <template #avatar>
                    <!-- TODO: Add institution logo when available -->
                    <div class="logo-placeholder">
                        <FontAwesomeIcon :icon="faBuilding" class="text-4xl text-gray-400" />
                    </div>
                </template>
            </DashboardDetailHeader>

            <!-- Tabs -->
            <TabNavigation :tabs="tabs" />

            <!-- Page Content -->
            <div class="tab-content">
                <RouterView :institution="institution"></RouterView>
            </div>
        </template>
    </DashboardContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo-placeholder {
    @apply flex h-full w-full items-center justify-center;
    @apply rounded-lg border border-gray-200 bg-gray-100;
}
</style>
