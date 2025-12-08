<script lang="ts" setup>
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const { locale } = useI18n();

const institutionName = computed(() => {
    const name = props.institution?.name;
    if (!name) return 'Instelling';
    return name[locale.value] ?? name.nl ?? 'Instelling';
});

const breadcrumbs = computed(() => [
    { label: 'Instellingen', to: { name: 'manage' } },
    {
        label: institutionName.value,
        to: { name: 'manage.institution.info', params: { institutionId: props.institution.id } },
    },
    { label: 'Instellingen' },
]);
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Instellingen" />

        <p class="mb-6 text-slate-600">Beheer geavanceerde instellingen voor deze instelling.</p>

        <!-- Information -->
        <Callout severity="info">
            <strong>Opmerking:</strong> Geavanceerde instellingen voor instellingen zijn momenteel
            niet beschikbaar. Neem contact op met de beheerder voor wijzigingen.
        </Callout>
    </LayoutContent>
</template>
