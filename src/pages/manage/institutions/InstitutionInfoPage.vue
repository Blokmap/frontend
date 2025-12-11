<script lang="ts" setup>
import InstitutionAddressCard from '@/components/features/institution/InstitutionAddressCard.vue';
import InstitutionInfoCard from '@/components/features/institution/InstitutionInfoCard.vue';
import InstitutionCard from '@/components/features/institution/InstitutionCard.vue';
import InstitutionContactCard from '@/components/features/institution/InstitutionContactCard.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import PageContent from '@/layouts/PageContent.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useUpdateInstitution,
    useUpdateInstitutionLogo,
    useDeleteInstitutionLogo,
} from '@/composables/data/useInstitutions';
import { type Institution, type InstitutionBody } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const { locale } = useI18n();

const basicInfoEditMode = ref(false);
const contactEditMode = ref(false);
const addressEditMode = ref(false);

const { mutateAsync: updateInstitution, isPending: isUpdating } = useUpdateInstitution();

async function saveInstitution(data: InstitutionBody) {
    await updateInstitution({ id: props.institution.id, data });
    basicInfoEditMode.value = false;
    contactEditMode.value = false;
    addressEditMode.value = false;
}

const logoDialogVisible = ref(false);

const { mutateAsync: updateInstitutionLogo, isPending: isUpdatingLogo } =
    useUpdateInstitutionLogo();

async function onUpdateLogo(file: File) {
    await updateInstitutionLogo({ institutionId: props.institution.id, file });
    logoDialogVisible.value = false;
}

const { mutateAsync: deleteInstitutionLogo, isPending: isDeletingLogo } =
    useDeleteInstitutionLogo();

async function onDeleteLogo() {
    await deleteInstitutionLogo(props.institution.id);
    logoDialogVisible.value = false;
}

const breadcrumbs = computed(() => {
    const institutionName = props.institution.name[locale.value] || props.institution.name.nl;

    return [
        { label: 'Instellingen', to: { name: 'manage' } },
        {
            label: institutionName ?? 'N/A',
            to: {
                name: 'manage.institution.info',
                params: {
                    institutionId: props.institution.id,
                },
            },
        },
        { label: 'Profiel' },
    ];
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <InstitutionCard
            :institution="institution"
            :avatar-editable="true"
            :updating="isUpdatingLogo"
            :deleting="isDeletingLogo"
            v-model:avatar-dialog-visible="logoDialogVisible"
            @update:avatar="onUpdateLogo"
            @delete:avatar="onDeleteLogo">
        </InstitutionCard>

        <div class="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <InstitutionInfoCard
                v-model:edit-mode="basicInfoEditMode"
                :institution="institution"
                :is-updating="isUpdating"
                @save="saveInstitution">
            </InstitutionInfoCard>

            <InstitutionContactCard
                v-model:edit-mode="contactEditMode"
                :institution="institution"
                :is-updating="isUpdating"
                @save="saveInstitution">
            </InstitutionContactCard>

            <InstitutionAddressCard
                v-model:edit-mode="addressEditMode"
                :institution="institution"
                :is-updating="isUpdating"
                @save="saveInstitution">
            </InstitutionAddressCard>
        </div>
    </PageContent>
</template>
