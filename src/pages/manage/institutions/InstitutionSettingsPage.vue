<script lang="ts" setup>
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import PageContent from '@/pages/PageContent.vue';
import PageTitle from '@/pages/PageTitle.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const { locale, t } = useI18n();

const breadcrumbs = computed(() => {
    const institutionName = props.institution.name[locale.value] ?? t('common.unknown');

    return [
        { label: 'Instellingen', to: { name: 'manage' } },
        {
            label: institutionName,
            to: {
                name: 'manage.institution.info',
                params: {
                    institutionId: props.institution.id,
                },
            },
        },
        { label: 'Instellingen' },
    ];
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Instellingen" />

        <!-- Information -->
        <Callout severity="info">
            <strong>Komt Binnenkort:</strong> In Blokmap v1.0 zal je met geavanceerde instellingen
            specifieke configuraties voor deze organisatie kunnen beheren, waaronder het abonnement,
            betalingsopties en integraties met externe diensten. Volg de vooruitgang gemakkelijk op
            onze <a href="https://docs.blokmap.com" class="underline">documentatiewebsite</a>.
        </Callout>
    </PageContent>
</template>
