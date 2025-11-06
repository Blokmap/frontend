<script setup lang="ts">
import InstitutionMembershipTable from '@/components/features/institution/InstitutionMembershipTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useReadProfileInstitutionMemberships } from '@/composables/data/useMembers';
import type { InstitutionMembership } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    isOwnProfile: boolean;
}>();

const router = useRouter();

const { data: memberships, isLoading } = useReadProfileInstitutionMemberships(
    computed(() => props.profile.id),
);

/**
 * Handle clicking on an membership to view its details.
 * @param membership The membership that was clicked.
 */
function onMembershipClick(membership: InstitutionMembership): void {
    router.push({
        name: 'dashboard.institutions.detail.overview',
        params: { institutionId: membership.institution.id },
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
        <InstitutionMembershipTable
            :memberships="memberships"
            :loading="isLoading"
            @click:membership="onMembershipClick">
        </InstitutionMembershipTable>
    </DashboardContent>
</template>
