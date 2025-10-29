<script setup lang="ts">
import Card from 'primevue/card';
import InstitutionForm from '@/components/features/institution/forms/InstitutionForm.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { useUpdateInstitution } from '@/composables/data/useInstitutions';
import { useToast } from '@/composables/store/useToast';
import type { Institution, InstitutionRequest } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
}>();

const toast = useToast();

const { mutateAsync: updateInstitution, isPending: isUpdating } = useUpdateInstitution();

/**
 * Handle form submission to update the institution
 */
async function handleUpdate(form: InstitutionRequest): Promise<void> {
    try {
        await updateInstitution({
            id: props.institution.id,
            data: form,
        });

        toast.add({
            severity: 'success',
            summary: 'Opgeslagen',
            detail: 'De institutie is succesvol bijgewerkt.',
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij opslaan',
            detail: 'Er is iets misgegaan bij het bijwerken van de institutie.',
        });
    }
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader
            title="Institutiegegevens"
            secondary="Bekijk en bewerk institutiegegevens.">
        </DashboardDetailHeader>

        <!-- Institution Information Card -->
        <Card>
            <template #content>
                <InstitutionForm
                    :institution="institution"
                    :is-loading="isUpdating"
                    @click:save="handleUpdate">
                </InstitutionForm>
            </template>
        </Card>
    </DashboardContent>
</template>
