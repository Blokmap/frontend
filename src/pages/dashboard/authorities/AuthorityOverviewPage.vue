<script setup lang="ts">
import Card from 'primevue/card';
import AuthorityForm from '@/components/features/authority/forms/AuthorityForm.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { useUpdateAuthority } from '@/composables/data/useAuthorities';
import { useToast } from '@/composables/store/useToast';
import type { Authority, AuthorityRequest } from '@/domain/authority';

const props = defineProps<{
    authority: Authority;
}>();

const toast = useToast();

const { mutateAsync: updateAuthority, isPending: isUpdating } = useUpdateAuthority();

/**
 * Handle form submission to update the authority
 */
async function handleUpdate(form: AuthorityRequest): Promise<void> {
    try {
        await updateAuthority({
            id: props.authority.id,
            data: form,
        });

        toast.add({
            severity: 'success',
            summary: 'Opgeslagen',
            detail: 'De autoriteit is succesvol bijgewerkt.',
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij opslaan',
            detail: 'Er is iets misgegaan bij het bijwerken van de autoriteit.',
        });
    }
}
</script>

<template>
    <DashboardContent>
        <div class="space-y-6">
            <!-- Header -->
            <DashboardDetailHeader
                title="Autoriteitgegevens"
                secondary="Bekijk en bewerk autoriteitgegevens.">
            </DashboardDetailHeader>

            <!-- Authority Information Card -->
            <Card>
                <template #content>
                    <AuthorityForm
                        :authority="authority"
                        :is-loading="isUpdating"
                        @click:save="handleUpdate">
                    </AuthorityForm>
                </template>
            </Card>
        </div>
    </DashboardContent>
</template>
