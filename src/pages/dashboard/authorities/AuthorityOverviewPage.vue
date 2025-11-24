<script setup lang="ts">
import Card from 'primevue/card';
import AuthorityForm from '@/components/features/authority/forms/AuthorityForm.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/manage/details/DashboardDetailHeader.vue';
import { useUpdateAuthority } from '@/composables/data/useAuthorities';
import type { Authority, AuthorityBody } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authority: Authority;
    profile: Profile;
}>();

const { mutateAsync: updateAuthority, isPending: isUpdating } = useUpdateAuthority();

/**
 * Handle form submission to update the authority
 *
 * @param form - The updated authority data
 */
async function handleUpdate(form: AuthorityBody): Promise<void> {
    updateAuthority({
        id: props.authority.id,
        data: form,
    });
}
</script>

<template>
    <DashboardContent>
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
                    :loading="isUpdating"
                    @click:save="handleUpdate">
                </AuthorityForm>
            </template>
        </Card>
    </DashboardContent>
</template>
