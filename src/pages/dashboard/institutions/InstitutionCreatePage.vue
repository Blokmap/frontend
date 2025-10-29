<script setup lang="ts">
import Card from 'primevue/card';
import InstitutionForm from '@/components/features/institution/forms/InstitutionForm.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCreateInstitution } from '@/composables/data/useInstitutions';
import { useToast } from '@/composables/store/useToast';
import type { InstitutionRequest } from '@/domain/institution';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const { mutateAsync: createInstitution, isPending } = useCreateInstitution({});

/**
 * Handles the form submission by creating a new institution.
 */
async function handleSave(form: InstitutionRequest): Promise<void> {
    try {
        const institution = await createInstitution(form);
        toast.add({
            severity: 'success',
            summary: t('domains.institutions.success.created'),
            detail: t('domains.institutions.success.createdDetail'),
        });
        router.push({
            name: 'dashboard.institutions.detail',
            params: { institutionId: institution.slug },
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: t('domains.institutions.errors.createFailed'),
            detail: t('domains.institutions.errors.createFailedDetail'),
        });
    }
}
</script>

<template>
    <DashboardContent>
        <DashboardPageHeader
            :title="$t('pages.dashboard.institutions.create.title')"
            :subtitle="$t('pages.dashboard.institutions.create.subtitle')">
        </DashboardPageHeader>

        <Card class="max-w-4xl">
            <template #content>
                <InstitutionForm :loading="isPending" @click:save="handleSave" />
            </template>
        </Card>
    </DashboardContent>
</template>
