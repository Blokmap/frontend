<script lang="ts" setup>
import AuthorityCard from '@/components/features/authority/AuthorityCard.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { computed } from 'vue';
import {
    useUpdateAuthority,
    useUpdateAuthorityLogo,
    useDeleteAuthorityLogo,
} from '@/composables/data/useAuthorities';
import { useReadProfileInstitutionMemberships } from '@/composables/data/useMembers';
import { type Authority, type AuthorityBody } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const { data: institutions } = useReadProfileInstitutionMemberships(
    computed(() => props.authProfile.id),
);

const { mutateAsync: updateAuthority, isPending: isUpdatingAuthority } = useUpdateAuthority();

const { mutateAsync: updateAuthorityLogo, isPending: isUpdatingAuthorityLogo } =
    useUpdateAuthorityLogo();

const { mutateAsync: deleteAuthorityLogo, isPending: isDeletingAuthorityLogo } =
    useDeleteAuthorityLogo();

async function handleAuthorityUpdate(data: AuthorityBody) {
    await updateAuthority({ id: props.authority.id, data });
}

async function handleLogoUpdate(file: File) {
    await updateAuthorityLogo({ authorityId: props.authority.id, file });
}

async function handleLogoDelete() {
    await deleteAuthorityLogo(props.authority.id);
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
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Informatie" />

        <AuthorityCard
            :authority="authority"
            :institutions="institutions"
            :saving="isUpdatingAuthority"
            :avatar-updating="isUpdatingAuthorityLogo"
            :avatar-deleting="isDeletingAuthorityLogo"
            editable
            @update:authority="handleAuthorityUpdate"
            @update:avatar="handleLogoUpdate"
            @delete:avatar="handleLogoDelete" />
    </LayoutContent>
</template>
