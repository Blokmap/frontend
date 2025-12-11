<script lang="ts" setup>
import AuthorityCard from '@/components/features/authority/AuthorityCard.vue';
import AuthorityInfoCard from '@/components/features/authority/AuthorityInfoCard.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import { computed, ref } from 'vue';
import {
    useUpdateAuthority,
    useUpdateAuthorityLogo,
    useDeleteAuthorityLogo,
} from '@/composables/data/useAuthorities';
import { type Authority, type AuthorityBody } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const infoEditMode = ref(false);

const { mutateAsync: updateAuthority, isPending: isUpdatingAuthority } = useUpdateAuthority();

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
