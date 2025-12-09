<script lang="ts" setup>
import InstitutionCard from '@/components/features/institution/InstitutionCard.vue';
import InstitutionForm from '@/components/features/institution/forms/InstitutionForm.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import SaveBar from '@/components/shared/molecules/SaveBar.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useUpdateInstitution,
    useUpdateInstitutionLogo,
    useDeleteInstitutionLogo,
} from '@/composables/data/useInstitutions';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { institutionToBody, type Institution, type InstitutionBody } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const { locale } = useI18n();

const { mutateAsync: updateInstitution, isPending: isUpdatingInstitution } = useUpdateInstitution();

const { mutateAsync: updateInstitutionLogo, isPending: isUpdatingInstitutionLogo } =
    useUpdateInstitutionLogo();

const { mutateAsync: deleteInstitutionLogo, isPending: isDeletingInstitutionLogo } =
    useDeleteInstitutionLogo();

const {
    form: institutionForm,
    hasChanges,
    isUpdating,
    saveChanges,
    cancelChanges,
} = useDirtyForm({
    source: () => props.institution,
    toForm: institutionToBody,
    onSave: async (formData) => {
        await updateInstitution({ id: props.institution.id, data: formData });
    },
    isPending: isUpdatingInstitution,
});

async function handleInstitutionUpdate(data: InstitutionBody) {
    await updateInstitution({ id: props.institution.id, data });
}

async function handleLogoUpdate(file: File) {
    await updateInstitutionLogo({ institutionId: props.institution.id, file });
}

async function handleLogoDelete() {
    await deleteInstitutionLogo(props.institution.id);
}

const institutionName = computed(() => {
    const name = props.institution?.name;
    if (!name) return 'Instelling';
    return name[locale.value] ?? name.nl ?? 'Instelling';
});

const breadcrumbs = computed(() => [
    { label: 'Instellingen', to: { name: 'manage' } },
    {
        label: institutionName.value,
        to: { name: 'manage.institution.info', params: { institutionId: props.institution.id } },
    },
    { label: 'Informatie' },
]);
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Informatie" />

        <InstitutionCard
            :institution="institution"
            :saving="isUpdatingInstitution"
            :avatar-updating="isUpdatingInstitutionLogo"
            :avatar-deleting="isDeletingInstitutionLogo"
            editable
            @update:institution="handleInstitutionUpdate"
            @update:avatar="handleLogoUpdate"
            @delete:avatar="handleLogoDelete" />

        <InstitutionForm
            v-if="institutionForm"
            :institution="institution"
            @click:save="saveChanges">
        </InstitutionForm>

        <SaveBar
            :show="hasChanges"
            :loading="isUpdating"
            @save="saveChanges"
            @cancel="cancelChanges" />
    </LayoutContent>
</template>
