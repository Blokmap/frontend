<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import ConfirmDialog from '@/components/molecules/ConfirmDialog.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDeleteAuthority } from '@/composables/data/useAuthorities';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const router = useRouter();

const showDeleteDialog = ref(false);

const { mutate: deleteAuthority } = useDeleteAuthority({
    onSuccess: () => {
        router.push({ name: 'manage' });
    },
});

const breadcrumbs = computed(() => [
    { label: 'Groepen', to: { name: 'manage' } },
    {
        label: props.authority?.name ?? 'Groep',
        to: { name: 'manage.authority.info', params: { authorityId: props.authority.id } },
    },
    { label: 'Instellingen' },
]);

function onDeleteClick(): void {
    deleteAuthority(props.authority.id);
    showDeleteDialog.value = false;
}
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Instellingen" />

        <p class="mb-6 text-slate-600">Beheer geavanceerde instellingen voor deze groep.</p>

        <ConfirmDialog
            v-model:visible="showDeleteDialog"
            :message="`Weet je zeker dat je '${authority.name}' wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`"
            header="Groep verwijderen"
            severity="danger"
            @confirm="onDeleteClick">
        </ConfirmDialog>
    </PageContent>
</template>
