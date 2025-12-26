<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import AuthorityCard from '@/components/molecules/authority/AuthorityCard.vue';
import AuthorityInfoCard from '@/components/molecules/authority/AuthorityInfoCard.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useUpdateAuthority,
    useUpdateAuthorityLogo,
    useDeleteAuthorityLogo,
} from '@/composables/data/useAuthorities';
import { type Authority, type AuthorityBody } from '@/domain/authority';
import { getInstitutionName } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const { locale } = useI18n();

const { mutateAsync: updateAuthority, isPending: isUpdatingAuthority } = useUpdateAuthority();

const infoEditMode = ref(false);

async function saveAuthority(data: AuthorityBody) {
    await updateAuthority({ id: props.authority.id, data });
    infoEditMode.value = false;
}

const logoDialogVisible = ref<boolean>(false);

const { mutateAsync: updateLogo, isPending: isUpdatingLogo } = useUpdateAuthorityLogo();

async function onLogoUpdate(file: File) {
    await updateLogo({ authorityId: props.authority.id, file });
}

const { mutateAsync: deleteLogo, isPending: isDeletingLogo } = useDeleteAuthorityLogo();

async function onLogoDelete() {
    await deleteLogo(props.authority.id);
}

const breadcrumbs = computed(() => {
    const institutionId = props.authority.institution?.id;
    const institutionName = getInstitutionName(props.authority.institution, locale.value);

    return [
        {
            label: institutionName,
            to: {
                name: 'manage.institution.info',
                params: {
                    institutionId,
                },
            },
        },
        {
            label: props.authority.name,
            to: {
                name: 'manage.authority.info',
                params: {
                    authorityId: props.authority.id,
                },
            },
        },
        {
            label: 'Informatie',
        },
    ];
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Informatie" />

        <AuthorityCard
            :authority="authority"
            :updating="isUpdatingLogo"
            :deleting="isDeletingLogo"
            v-model:avatar-dialog-visible="logoDialogVisible"
            avatar-editable
            @update:avatar="onLogoUpdate"
            @delete:avatar="onLogoDelete">
        </AuthorityCard>

        <div class="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <AuthorityInfoCard
                v-model:edit-mode="infoEditMode"
                :authority="authority"
                :is-updating="isUpdatingAuthority"
                @save="saveAuthority">
            </AuthorityInfoCard>
        </div>
    </PageContent>
</template>
