<script setup lang="ts">
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
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
        <AuthorityTable
            :authorities="authorities"
            :loading="false"
            empty-message="Dit profiel is niet gekoppeld aan autoriteiten."
            @click:authority="onAuthorityClick">
        </AuthorityTable>
    </DashboardContent>
</template>
