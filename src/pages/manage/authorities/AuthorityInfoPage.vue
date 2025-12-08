<script lang="ts" setup>
import AuthorityForm from '@/components/features/authority/forms/AuthorityForm.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import SaveBar from '@/components/shared/molecules/SaveBar.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { computed } from 'vue';
import { useUpdateAuthority } from '@/composables/data/useAuthorities';
import { useReadProfileInstitutionMemberships } from '@/composables/data/useMembers';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { authorityToBody, type Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const { data: institutions } = useReadProfileInstitutionMemberships(
    computed(() => props.authProfile.id),
);

const { mutateAsync: updateAuthority, isPending: isUpdatingAuthority } = useUpdateAuthority();

const {
    form: authorityForm,
    hasChanges,
    isUpdating,
    saveChanges,
    cancelChanges,
} = useDirtyForm({
    source: () => props.authority,
    toForm: authorityToBody,
    onSave: async (formData) => {
        await updateAuthority({ id: props.authority.id, data: formData });
    },
    isPending: isUpdatingAuthority,
});

const breadcrumbs = computed(() => [
    { label: 'Groepen', to: { name: 'manage' } },
    {
        label: props.authority.name,
        to: {
            name: 'manage.authority.info',
            params: {
                authorityId: props.authority.id,
            },
        },
    },
    { label: 'Informatie' },
]);
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Informatie" />

        <AuthorityForm
            v-if="authorityForm"
            :authority="authority"
            :institutions="institutions"
            @click:save="saveChanges">
        </AuthorityForm>

        <SaveBar
            :show="hasChanges"
            :loading="isUpdating"
            @save="saveChanges"
            @cancel="cancelChanges" />
    </LayoutContent>
</template>
