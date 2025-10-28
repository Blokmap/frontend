<script setup lang="ts">
import Card from 'primevue/card';
import InstitutionTable from '@/components/features/institution/InstitutionTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
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
        <div class="space-y-6">
            <!-- Header -->
            <DashboardDetailHeader
                title="Instituties"
                secondary="Bekijk instituties gekoppeld aan dit profiel.">
            </DashboardDetailHeader>

            <!-- Institutions Table -->
            <Card>
                <template #content>
                    <InstitutionTable
                        :institutions="institutions"
                        :loading="false"
                        @click:institution="onInstitutionClick">
                    </InstitutionTable>
                </template>
            </Card>
        </div>
    </DashboardContent>
</template>
