<script setup lang="ts">
import AuthorityActionMenu from '@/components/features/authority/AuthorityActionMenu.vue';
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/manage/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Paginator } from 'primevue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
    useDeleteAuthority,
    useReadInstitutionAuthorities,
} from '@/composables/data/useAuthorities';
import { usePagination } from '@/composables/usePagination';
import { type Authority, type AuthorityFilter } from '@/domain/authority';
import { type Institution } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
}>();

const router = useRouter();

const {
    mutateAsync: deleteAuthority,
    isPending: isPendingDelete,
    variables,
} = useDeleteAuthority();

const filters = ref<AuthorityFilter>({
    page: 1,
    perPage: 25,
});

const { first, onPageChange } = usePagination(filters);

const { data: authorities, isLoading } = useReadInstitutionAuthorities(
    computed(() => props.institution.id),
    filters,
);

/**
 * Check if a specific authority is pending deletion.
 * @param authority - The authority to check.
 */
function isAuthorityPending(authority: { id: number }): boolean {
    return variables.value === authority.id && isPendingDelete.value;
}

/**
 * Handle clicking on an authority to view its details.
 * @param authority - The authority that was clicked.
 */
function onAuthorityClick(authority: Authority) {
    router.push({
        name: 'dashboard.authorities.detail.overview',
        params: { authorityId: authority.id },
    });
}

/**
 * Handle deleting an authority.
 * @param authorityId - The ID of the authority to delete.
 */
function onAuthorityDeleteClick(authorityId: number): void {
    deleteAuthority(authorityId);
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader
            title="Autoriteiten"
            secondary="Beheer autoriteiten gekoppeld aan deze institutie.">
            <template #actions>
                <RouterLink :to="{ name: 'dashboard.authorities.create' }">
                    <PageHeaderButton label="Autoriteit Aanmaken">
                        <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                    </PageHeaderButton>
                </RouterLink>
            </template>
        </DashboardDetailHeader>

        <!-- Authorities Table -->
        <AuthorityTable
            :authorities="authorities?.data"
            :loading="isLoading"
            @click:authority="onAuthorityClick">
            <template #actions="{ authority }">
                <AuthorityActionMenu
                    :authority="authority"
                    :is-pending="isAuthorityPending(authority)"
                    @click:delete="onAuthorityDeleteClick" />
            </template>
        </AuthorityTable>

        <Paginator
            :first="first(authorities)"
            :rows="authorities?.perPage"
            :total-records="authorities?.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
