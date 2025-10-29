<script setup lang="ts">
import InstitutionTable from '@/components/features/institution/InstitutionTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    isOwnProfile: boolean;
}>();

const router = useRouter();

const institutions = computed(() => (props.profile.institution ? [props.profile.institution] : []));

/**
 * Handle clicking on an institution to view its details.
 * @param institution The institution that was clicked.
 */
function onInstitutionClick(institution: Institution): void {
    router.push({
        name: 'dashboard.institutions.detail.overview',
        params: { institutionId: institution.slug },
    });
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Instituties">
            <template #secondary>
                <span v-if="isOwnProfile">
                    Bekijk en beheer instituties gekoppeld aan jouw profiel.
                </span>
                <span v-else>
                    Bekijk en beheer instituties gekoppeld aan {{ profile.firstName }}'s profiel.
                </span>
            </template>
        </DashboardDetailHeader>

        <!-- Institutions Table -->
        <InstitutionTable
            :institutions="institutions"
            :loading="false"
            @click:institution="onInstitutionClick">
        </InstitutionTable>
    </DashboardContent>
</template>
