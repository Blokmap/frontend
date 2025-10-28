<script setup lang="ts">
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
}>();

const router = useRouter();

const authorities = computed(() => props.profile.authorities || []);

/**
 * Handle clicking on an authority to view its details.
 * @param authority The authority that was clicked.
 */
function onAuthorityClick(authority: Authority): void {
    router.push({ name: 'dashboard.authorities.detail', params: { authorityId: authority.id } });
}
</script>

<template>
    <DashboardContent>
        <div class="space-y-6">
            <!-- Header -->
            <DashboardDetailHeader
                title="Autoriteiten"
                secondary="Bekijk autoriteiten gekoppeld aan dit profiel.">
            </DashboardDetailHeader>

            <!-- Authorities Table -->
            <AuthorityTable
                :authorities="authorities"
                :loading="false"
                empty-message="Dit profiel is niet gekoppeld aan autoriteiten."
                @click:authority="onAuthorityClick">
            </AuthorityTable>
        </div>
    </DashboardContent>
</template>
