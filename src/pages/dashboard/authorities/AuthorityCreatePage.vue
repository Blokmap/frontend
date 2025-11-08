<script setup lang="ts">
import Card from 'primevue/card';
import AuthorityForm from '@/components/features/authority/forms/AuthorityForm.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCreateAuthority } from '@/composables/data/useAuthorities';
import { useReadProfileInstitutionMemberships } from '@/composables/data/useMembers';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{ profile: Profile }>();

const router = useRouter();

const { data: institutions } = useReadProfileInstitutionMemberships(
    computed(() => props.profile.id),
);

const { mutateAsync: createAuthority, isPending } = useCreateAuthority({
    onSuccess: (authority: Authority) => {
        router.push({
            name: 'dashboard.authorities.detail.overview',
            params: { authorityId: authority.id },
        });
    },
});
</script>

<template>
    <DashboardContent>
        <DashboardPageHeader
            :title="$t('pages.dashboard.authorities.create.title')"
            :subtitle="$t('pages.dashboard.authorities.create.subtitle')">
        </DashboardPageHeader>

        <Card class="max-w-4xl">
            <template #content>
                <AuthorityForm
                    :institutions="institutions"
                    :loading="isPending"
                    @click:save="createAuthority" />
            </template>
        </Card>
    </DashboardContent>
</template>
