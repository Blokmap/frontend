<script lang="ts" setup>
import InstitutionAddressCard from '@/components/features/institution/InstitutionAddressCard.vue';
import InstitutionBasicInfoCard from '@/components/features/institution/InstitutionBasicInfoCard.vue';
import InstitutionContactCard from '@/components/features/institution/InstitutionContactCard.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import EntityCard from '@/components/shared/molecules/EntityCard.vue';
import PageContent from '@/layouts/PageContent.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
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

const { locale, t } = useI18n();

const avatarDialogVisible = ref(false);
const basicInfoEditMode = ref(false);
const contactEditMode = ref(false);
const addressEditMode = ref(false);

const { mutateAsync: updateInstitution, isPending: isUpdating } = useUpdateInstitution();

const { mutateAsync: updateInstitutionLogo, isPending: isUpdatingLogo } =
    useUpdateInstitutionLogo();

const { mutateAsync: deleteInstitutionLogo, isPending: isDeletingLogo } =
    useDeleteInstitutionLogo();

const institutionName = computed(() => {
    const name = props.institution?.name;
    if (!name) return 'N/A';
    return name[locale.value] ?? name.nl ?? 'N/A';
});

const breadcrumbs = computed(() => [
    { label: 'Instellingen', to: { name: 'manage' } },
    {
        label: institutionName.value,
        to: {
            name: 'manage.institution.info',
            params: {
                institutionId: props.institution.id,
            },
        },
    },
    { label: 'Profiel' },
]);

async function saveInstitution(data: InstitutionBody) {
    await updateInstitution({ id: props.institution.id, data });
    basicInfoEditMode.value = false;
    contactEditMode.value = false;
    addressEditMode.value = false;
}

async function onUpdateAvatar(file: File) {
    await updateInstitutionLogo({ institutionId: props.institution.id, file });
    avatarDialogVisible.value = false;
}

async function onDeleteAvatar() {
    await deleteInstitutionLogo(props.institution.id);
    avatarDialogVisible.value = false;
}
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <EntityCard
            :avatar-image="institution.logo?.url"
            :avatar-icon="faBuilding"
            :avatar-editable="true"
            :avatar-updating="isUpdatingLogo"
            :avatar-deleting="isDeletingLogo"
            :avatar-dialog-visible="avatarDialogVisible"
            @update:avatar-dialog-visible="avatarDialogVisible = $event"
            @update:avatar="onUpdateAvatar"
            @delete:avatar="onDeleteAvatar">
            <template #avatar-dialog-title>
                <h2 class="avatar-dialog__title">Logo</h2>
            </template>
            <template #avatar-dialog-subtitle>
                <p class="avatar-dialog__subtitle">Upload het logo van deze instelling</p>
            </template>
            <template #content>
                <h2 class="text-2xl font-bold">{{ institutionName }}</h2>
                <p class="text-sm text-gray-500">{{ institution.slug || 'N/A' }}</p>
                <p class="text-sm text-gray-600">
                    {{ t(`domains.institutions.category.${institution.category}`) }}
                </p>
            </template>
        </EntityCard>

        <div class="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <InstitutionBasicInfoCard
                v-model:edit-mode="basicInfoEditMode"
                :institution="institution"
                :is-updating="isUpdating"
                @save="saveInstitution">
            </InstitutionBasicInfoCard>

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
