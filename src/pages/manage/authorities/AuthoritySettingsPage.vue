<script lang="ts" setup>
import Button from 'primevue/button';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import ConfirmDialog from '@/components/shared/molecules/ConfirmDialog.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
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

const { mutate: deleteAuthority, isPending: isDeleting } = useDeleteAuthority({
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
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Instellingen" />

        <p class="mb-6 text-slate-600">Beheer geavanceerde instellingen voor deze groep.</p>

        <!-- Danger Zone -->
        <section class="rounded-lg border border-red-200 bg-red-50 p-6">
            <h3 class="mb-2 text-lg font-semibold text-red-900">Gevaarlijke zone</h3>
            <p class="mb-4 text-red-700">
                Het verwijderen van deze groep kan niet ongedaan worden gemaakt. Alle geassocieerde
                data gaat verloren.
            </p>

            <Callout severity="warn" class="mb-4">
                <strong>Let op:</strong> Deze actie verwijdert de groep permanent en kan niet
                ongedaan worden gemaakt.
            </Callout>

            <Button severity="danger" :loading="isDeleting" @click="showDeleteDialog = true">
                <FontAwesomeIcon :icon="faTrash" class="mr-2" />
                Groep verwijderen
            </Button>
        </section>

        <ConfirmDialog
            v-model:visible="showDeleteDialog"
            :message="`Weet je zeker dat je '${authority.name}' wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`"
            header="Groep verwijderen"
            severity="danger"
            @confirm="onDeleteClick" />
    </LayoutContent>
</template>
