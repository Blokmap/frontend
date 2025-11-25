<script setup lang="ts">
import Card from 'primevue/card';
import InstitutionForm from '@/components/features/institution/forms/InstitutionForm.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/manage/DashboardPageHeader.vue';
import { useRouter } from 'vue-router';
import { useCreateInstitution } from '@/composables/data/useInstitutions';
import type { Institution } from '@/domain/institution';

const router = useRouter();

const { mutateAsync: createInstitution, isPending } = useCreateInstitution({
    onSuccess: (institution: Institution) => {
        router.push({
            name: 'dashboard.institutions.detail',
            params: { institutionId: institution.slug },
        });
    },
});
</script>

<template>
    <DashboardContent>
        <DashboardPageHeader
            :title="$t('pages.dashboard.institutions.create.title')"
            :subtitle="$t('pages.dashboard.institutions.create.subtitle')">
        </DashboardPageHeader>

        <Card class="max-w-4xl">
            <template #content>
                <InstitutionForm :loading="isPending" @click:save="createInstitution" />
            </template>
        </Card>
    </DashboardContent>
</template>
