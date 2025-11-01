<script setup lang="ts">
import Card from 'primevue/card';
import AuthorityForm from '@/components/features/authority/forms/AuthorityForm.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCreateAuthority } from '@/composables/data/useAuthorities';
import { useToast } from '@/composables/store/useToast';
import type { AuthorityBody } from '@/domain/authority';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const { mutateAsync: createAuthority, isPending } = useCreateAuthority({});

/**
 * Handles the form submission by creating a new authority.
 */
async function handleSave(form: AuthorityBody): Promise<void> {
    try {
        const authority = await createAuthority(form);
        toast.add({
            severity: 'success',
            summary: t('domains.authorities.success.created'),
            detail: t('domains.authorities.success.createdDetail'),
        });
        router.push({
            name: 'dashboard.authorities.detail.overview',
            params: { authorityId: authority.id },
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: t('domains.authorities.errors.createFailed'),
            detail: t('domains.authorities.errors.createFailedDetail'),
        });
    }
}
</script>

<template>
    <DashboardContent>
        <DashboardPageHeader
            :title="$t('pages.dashboard.authorities.create.title')"
            :subtitle="$t('pages.dashboard.authorities.create.subtitle')">
        </DashboardPageHeader>

        <Card class="max-w-4xl">
            <template #content>
                <AuthorityForm :loading="isPending" @click:save="handleSave" />
            </template>
        </Card>
    </DashboardContent>
</template>
