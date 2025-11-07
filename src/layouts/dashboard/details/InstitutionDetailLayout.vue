<script setup lang="ts">
import InstitutionLogo from '@/components/features/institution/InstitutionLogo.vue';
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faBuilding, faList, faUsers, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReadInstitution } from '@/composables/data/useInstitutions';

const props = defineProps<{
    institutionId: string;
}>();

const { locale } = useI18n();

const {
    data: institution,
    isLoading,
    error,
} = useReadInstitution(computed(() => +props.institutionId));

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
    {
        value: 'members',
        label: 'Toegangsbeheer',
        align: 'right',
        icon: faUsersGear,
        route: {
            name: 'dashboard.institutions.detail.members',
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
                :loading="isLoading"
                :show-skeletons="true"
                avatar-shape="square"
                :title="institution?.name[locale] ?? undefined"
                :primary="institution?.slug"
                :secondary="institution?.email ?? undefined">
                <template #avatar>
                    <InstitutionLogo :slug="institution.slug" />
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
