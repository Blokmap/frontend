<script setup lang="ts">
import AuthorityActionMenu from '@/components/features/authority/AuthorityActionMenu.vue';
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Paginator } from 'primevue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useReadAuthorities } from '@/composables/data/useAuthorities';
import { usePagination } from '@/composables/data/usePagination';
import { type Institution } from '@/domain/institution';
import type { Authority } from '@/domain/authority';

const props = defineProps<{
    institution: Institution;
}>();

const router = useRouter();

const pagination = ref({
    page: 1,
    perPage: 25,
});

const { first, onPageChange } = usePagination(pagination);

const { data: authorities, isLoading } = useReadAuthorities(
    computed(() => ({ institution: props.institution.slug })),
);

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
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader
            title="Autoriteiten"
            secondary="Beheer autoriteiten gekoppeld aan deze institutie.">
            <template #actions>
                <PageHeaderButton
                    label="
                    Autoriteit Aanmaken"
                    :to="{ name: 'dashboard.authorities.create' }">
                    <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                </PageHeaderButton>
            </template>
        </DashboardDetailHeader>

        <!-- Authorities Table -->
        <AuthorityTable
            :authorities="authorities?.data"
            :loading="isLoading"
            @click:authority="onAuthorityClick">
            <template #actions="{ authority }">
                <AuthorityActionMenu :show-delete="false" :authority="authority" />
            </template>
        </AuthorityTable>

        <Paginator
            v-if="authorities?.data?.length"
            :first="first"
            :rows="authorities.perPage"
            :total-records="authorities.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
