<script setup lang="ts">
import Paginator from 'primevue/paginator';
import ProfileTable from '@/components/features/profile/table/ProfileTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faUserPlus, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { usePagination } from '@/composables/data/usePagination';
import { useReadInstitutionProfiles } from '@/composables/data/useProfile';
import type { Institution } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
}>();

const pagination = ref({
    page: 1,
    perPage: 25,
});

const { onPageChange, first } = usePagination(pagination);

const { data: profiles, isLoading } = useReadInstitutionProfiles(
    computed(() => props.institution.id),
    pagination,
);
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Leden" secondary="Beheer leden en hun rollen.">
            <template #actions>
                <RouterLink
                    :to="{
                        name: 'dashboard.institutions.detail.roles',
                        params: { institutionId: institution.id },
                    }">
                    <PageHeaderButton severity="contrast" label="Rollen Beheren">
                        <FontAwesomeIcon :icon="faUserTag" />
                    </PageHeaderButton>
                </RouterLink>
                <PageHeaderButton severity="contrast" label="Beheerder Toevoegen">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </DashboardDetailHeader>

        <!-- Profile Table -->
        <ProfileTable :profiles="profiles?.data" :loading="isLoading" />

        <Paginator
            v-if="profiles?.data?.length"
            :first="first"
            :rows="profiles.perPage"
            :total-records="profiles.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
