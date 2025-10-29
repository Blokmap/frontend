<script setup lang="ts">
import Button from 'primevue/button';
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useReadAuthorities } from '@/composables/data/useAuthorities';
import type { Authority } from '@/domain/authority';
import type { Institution } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
}>();

const router = useRouter();

const { data: authoritiesData, isLoading } = useReadAuthorities(
    computed(() => ({ institution: props.institution.slug })),
);

const authorities = computed(() => authoritiesData.value?.data || []);

function onAuthorityClick(authority: Authority) {
    router.push({ name: 'dashboard.authorities.detail', params: { authorityId: authority.id } });
}

function onAddAuthority() {
    // TODO: implement modal to create authority for this institution
    console.log('create authority for', props.institution.slug);
}

function onRemoveAuthority(authority: Authority) {
    // TODO: implement remove authority action
    console.log('remove authority', authority.id);
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader
            title="Autoriteiten"
            secondary="Beheer autoriteiten gekoppeld aan deze institutie.">
            <template #actions>
                <Button severity="primary" @click="onAddAuthority">
                    <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                    Autoriteit Aanmaken
                </Button>
            </template>
        </DashboardDetailHeader>

        <!-- Authorities Table -->
        <AuthorityTable
            :authorities="authorities"
            :loading="isLoading"
            @click:authority="onAuthorityClick">
            <template #actions="{ authority }">
                <!-- Provide a simple remove action in the slot; the real remove logic should call the appropriate composable -->
                <button
                    class="text-sm text-red-600 hover:underline"
                    @click.stop.prevent="() => onRemoveAuthority(authority)">
                    Verwijderen
                </button>
            </template>
        </AuthorityTable>
    </DashboardContent>
</template>
