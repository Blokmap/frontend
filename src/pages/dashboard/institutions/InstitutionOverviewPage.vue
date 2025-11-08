<script setup lang="ts">
import Card from 'primevue/card';
import InstitutionForm from '@/components/features/institution/forms/InstitutionForm.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { useUpdateInstitution } from '@/composables/data/useInstitutions';
import type { Institution, InstitutionBody } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
}>();

const { mutateAsync: updateInstitution, isPending: isUpdating } = useUpdateInstitution();

/**
 * Handle form submission to update the institution
 */
function handleUpdate(form: InstitutionBody): void {
    updateInstitution({
        id: props.institution.id,
        data: form,
    });
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
                    :loading="isUpdating"
                    @click:save="handleUpdate">
                </InstitutionForm>
            </template>
        </Card>
    </DashboardContent>
</template>
